// __components/forms/thumbnailForm.tsx
"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload/interface";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./thumbnailForm.module.scss";

interface ThumbNailFormProps {
  /** File URL 문자열 or RcFile (업로드된 파일) */
  thumbnails: (string | RcFile)[];
  cover: string | RcFile | null;

  /** 부모 lift-up: (string | RcFile)[] 로 올려보냄 */
  onChangeThumbnails: (next: (string | RcFile)[]) => void;
  onChangeCover: (next: string | RcFile | null) => void;

  previewCount?: number;
  maxSizeMB?: number;
}

export default function ThumbNailForm({
  thumbnails,
  cover,
  onChangeThumbnails,
  onChangeCover,
  previewCount = 3,
  maxSizeMB = 2,
}: ThumbNailFormProps) {
  const [thumbList, setThumbList] = useState<UploadFile[]>([]);
  const [coverList, setCoverList] = useState<UploadFile[]>([]);

  const createdUrlsRef = useRef<string[]>([]);
  const revokeAll = () => {
    createdUrlsRef.current.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {}
    });
    createdUrlsRef.current = [];
  };

  const toUploadFiles = (
    items: (string | RcFile)[],
    type: "thumb" | "cover"
  ): UploadFile[] => {
    return items.map((it, idx) => {
      if (typeof it === "string") {
        return {
          uid: `${type}-url-${idx}`,
          name: `${type}-${idx}`,
          status: "done",
          url: it,
        };
      } else {
        const url = URL.createObjectURL(it);
        createdUrlsRef.current.push(url);
        // RcFile는 uid를 이미 가짐. 그래도 안전하게 uid 보장
        return {
          uid: it.uid ?? `${type}-file-${idx}`,
          name: it.name ?? `${type}-${idx}`,
          status: "done",
          url,
          originFileObj: it, // ✅ RcFile
        };
      }
    });
  };

  useEffect(() => {
    revokeAll();
    setThumbList(toUploadFiles(thumbnails, "thumb"));
  }, [thumbnails]);

  useEffect(() => {
    revokeAll();
    setCoverList(cover ? toUploadFiles([cover], "cover") : []);
  }, [cover]);

  useEffect(() => revokeAll, []);

  const previewThumbUrls = useMemo(
    () =>
      thumbList.slice(0, previewCount).map((f) => f.thumbUrl || f.url || ""),
    [thumbList, previewCount]
  );
  const previewCoverUrl = useMemo(() => {
    const f = coverList[0];
    return f ? f.thumbUrl || f.url || "" : "";
  }, [coverList]);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isImg = /^image\/(png|jpeg|jpg|webp)$/.test(file.type);
    if (!isImg)
      return message.error("PNG/JPG/WEBP만 가능합니다."), Upload.LIST_IGNORE;
    const isLt = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLt)
      return (
        message.error(`이미지 크기는 ${maxSizeMB}MB 이하`), Upload.LIST_IGNORE
      );
    return false; // 실제 업로드 X (제출 시 multipart)
  };

  const ensureUrls = (list: UploadFile[]) =>
    list.map((f) => {
      if (!f.url && f.originFileObj) {
        const u = URL.createObjectURL(f.originFileObj as RcFile);
        createdUrlsRef.current.push(u);
        return { ...f, url: u };
      }
      return f;
    });

  const antdListToValues = (list: UploadFile[]): (string | RcFile)[] =>
    list
      .map((f) =>
        f.originFileObj
          ? (f.originFileObj as RcFile)
          : f.url ?? f.thumbUrl ?? ""
      )
      .filter(Boolean);

  /** ✅ 시그니처 맞춤 */
  const onChangeThumbs = (info: UploadChangeParam<UploadFile>) => {
    const next = ensureUrls(info.fileList);
    setThumbList(next);
    onChangeThumbnails(antdListToValues(next));
  };

  const onChangeCoverUpload = (info: UploadChangeParam<UploadFile>) => {
    const next = ensureUrls(info.fileList.slice(-1));
    setCoverList(next);
    const f = next[0];
    const value: string | RcFile | null = f
      ? (f.originFileObj as RcFile) || f.url || f.thumbUrl || null
      : null;
    onChangeCover(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>미리보기</div>

      <div className={styles.previewContainer}>
        {Array.from({ length: previewCount }).map((_, i) => (
          <div
            key={i}
            className={`${styles.thumbnailCard} ${
              !previewThumbUrls[i] ? styles.placeholder : ""
            }`}
          >
            {previewThumbUrls[i] ? (
              <img
                src={previewThumbUrls[i]}
                alt={`썸네일 ${i + 1}`}
                className={styles.thumbnail}
              />
            ) : (
              <span>썸네일 업로드</span>
            )}
          </div>
        ))}
        <div
          className={`${styles.thumbnailCard} ${
            !previewCoverUrl ? styles.placeholder : ""
          }`}
        >
          {previewCoverUrl ? (
            <img
              src={previewCoverUrl}
              alt="커버 이미지"
              className={styles.thumbnail}
            />
          ) : (
            <span>커버 업로드</span>
          )}
        </div>
      </div>

      <div className={styles.uploadSection}>
        <Upload
          accept="image/*"
          multiple
          listType="picture"
          fileList={thumbList}
          beforeUpload={beforeUpload}
          onChange={onChangeThumbs}
          showUploadList
        >
          <Button icon={<UploadOutlined />} className={styles.uploadButton}>
            <span>강좌 썸네일 등록하기</span>
          </Button>
        </Upload>
      </div>

      <div className={styles.uploadSection}>
        <Upload
          accept="image/*"
          maxCount={1}
          listType="picture"
          fileList={coverList}
          beforeUpload={beforeUpload}
          onChange={onChangeCoverUpload}
          showUploadList
        >
          <Button icon={<UploadOutlined />} className={styles.uploadButton}>
            <span>강좌 커버 등록하기</span>
          </Button>
        </Upload>
      </div>
    </div>
  );
}
