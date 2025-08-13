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
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./thumbnailForm.module.scss";

interface ThumbNailFormProps {
  /** File URL 문자열 or File (업로드된 파일) */
  thumbnails: (string | File)[];
  cover: string | File | null;

  /** 부모 lift-up: (string | File)[] 로 올려보냄 */
  onChangeThumbnails: (next: (string | File)[]) => void;
  onChangeCover: (next: string | File | null) => void;

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
  const [thumbList, setThumbList] = useState<UploadFile<RcFile>[]>([]);
  const [coverList, setCoverList] = useState<UploadFile<RcFile>[]>([]);
  // const [thumbList, setThumbList] = useState<UploadFile<RcFile>[]>([]);
  // const [coverList, setCoverList] = useState<UploadFile<RcFile>[]>([]);

  const createdUrlsRef = useRef<string[]>([]);
  const revokeAll = () => {
    createdUrlsRef.current.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {}
    });
    createdUrlsRef.current = [];
  };

  // const toUploadFiles = (
  //   items: (string | RcFile)[],
  //   type: "thumb" | "cover",
  // ): UploadFile<RcFile>[] => {
  //   return items.map((it, idx) => {
  //     if (typeof it === "string") {
  //       return {
  //         uid: `${type}-url-${idx}`,
  //         name: `${type}-${idx}`,
  //         status: "done",
  //         url: it,
  //       };
  //     } else {
  //       const url = URL.createObjectURL(it);
  //       createdUrlsRef.current.push(url);
  //       return {
  //         uid: it.uid ?? `${type}-file-${idx}`,
  //         name: it.name ?? `${type}-${idx}`,
  //         status: "done",
  //         url,
  //         originFileObj: it, // RcFile
  //       };
  //     }
  //   });
  // };

  // useEffect(() => {
  //   revokeAll();
  //   setThumbList(toUploadFiles(thumbnails, "thumb"));
  // }, [thumbnails]);

  // useEffect(() => {
  //   revokeAll();
  //   setCoverList(cover ? toUploadFiles([cover], "cover") : []);
  // }, [cover]);

  // useEffect(() => revokeAll, []);

  const previewThumbUrls = useMemo(
    () =>
      thumbList.slice(0, previewCount).map((f) => f.thumbUrl || f.url || ""),
    [thumbList, previewCount],
  );
  const previewCoverUrl = useMemo(() => {
    const f = coverList[0];
    return f ? f.thumbUrl || f.url || "" : "";
  }, [coverList]);

  // const beforeUpload: UploadProps<RcFile>["beforeUpload"] = (file) => {
  //   const isImg = /^image\/(png|jpeg|jpg|webp)$/.test(file.type);
  //   if (!isImg)
  //     return (message.error("PNG/JPG/WEBP만 가능합니다."), Upload.LIST_IGNORE);
  //   const isLt = file.size / 1024 / 1024 < maxSizeMB;
  //   if (!isLt)
  //     return (
  //       message.error(`이미지 크기는 ${maxSizeMB}MB 이하`),
  //       Upload.LIST_IGNORE
  //     );
  //   return false;
  // };

  // const ensureUrls = (list: UploadFile[]) =>
  //   list.map((f) => {
  //     if (!f.url && f.originFileObj) {
  //       const u = URL.createObjectURL(f.originFileObj as File);
  //       createdUrlsRef.current.push(u);
  //       return { ...f, url: u };
  //     }
  //     return f;
  //   });

  // const antdListToValues = (list: UploadFile[]): (string | File)[] =>
  //   list
  //     .map((f) =>
  //       f.originFileObj
  //         ? (f.originFileObj as File)
  //         : (f.url ?? f.thumbUrl ?? ""),
  //     )
  //     .filter(Boolean);

  // /** ✅ 시그니처 맞춤 */
  // const onChangeThumbs = (info: UploadChangeParam<UploadFile>) => {
  //   const next = ensureUrls(info.fileList);
  //   setThumbList(next);
  //   onChangeThumbnails(antdListToValues(next));
  // };

  // const onChangeCoverUpload = (info: UploadChangeParam<UploadFile>) => {
  //   const next = ensureUrls(info.fileList.slice(-1));
  //   setCoverList(next);
  //   const f = next[0];
  //   const value: string | File | null = f
  //     ? (f.originFileObj as File) || f.url || f.thumbUrl || null
  //     : null;
  //   onChangeCover(value);
  // };

  // Upload도 RcFile 제네릭으로
  const beforeUpload: UploadProps<RcFile>["beforeUpload"] = (file) => {
    const isImg = /^image\/(png|jpeg|jpg|webp)$/.test(file.type);
    if (!isImg)
      return (message.error("PNG/JPG/WEBP만 가능합니다."), Upload.LIST_IGNORE);
    const isLt = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLt)
      return (
        message.error(`이미지 크기는 ${maxSizeMB}MB 이하`),
        Upload.LIST_IGNORE
      );
    return false;
  };

  // RcFile[] → UploadFile<RcFile>[]
  const toUploadFiles = (
    items: (string | RcFile)[],
    type: "thumb" | "cover",
  ): UploadFile<RcFile>[] => {
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
        return {
          uid: it.uid ?? `${type}-file-${idx}`,
          name: it.name ?? `${type}-${idx}`,
          status: "done",
          url,
          originFileObj: it, // RcFile
        };
      }
    });
  };

  // cleanup 타이밍: 이전 것만 해제
  useEffect(() => {
    const next = toUploadFiles(thumbnails as (string | RcFile)[], "thumb");
    setThumbList(next);
    return () => revokeAll();
  }, [thumbnails]);

  useEffect(() => {
    const next = cover ? toUploadFiles([cover as RcFile], "cover") : [];
    setCoverList(next);
    return () => revokeAll();
  }, [cover]);

  const ensureUrls = (list: UploadFile<RcFile>[]) =>
    list.map((f) => {
      if (!f.url && f.originFileObj) {
        const u = URL.createObjectURL(f.originFileObj);
        createdUrlsRef.current.push(u);
        return { ...f, url: u };
      }
      return f;
    });

  // 부모로 넘길 때만 RcFile -> File로 변환
  const rcToFile = (rc: RcFile): File =>
    new File([rc], rc.name, { type: rc.type, lastModified: rc.lastModified });

  const antdListToValues = (list: UploadFile<RcFile>[]): (string | File)[] =>
    list
      .map((f) =>
        f.originFileObj
          ? rcToFile(f.originFileObj)
          : (f.url ?? f.thumbUrl ?? ""),
      )
      .filter(Boolean) as (string | File)[];

  const onChangeThumbs = (info: UploadChangeParam<UploadFile<RcFile>>) => {
    const next = ensureUrls(info.fileList);
    setThumbList(next);
    onChangeThumbnails(antdListToValues(next)); // 부모엔 (string|File)[]
  };

  const onChangeCoverUpload = (info: UploadChangeParam<UploadFile<RcFile>>) => {
    const next = ensureUrls(info.fileList.slice(-1));
    setCoverList(next);
    const f = next[0];
    const value: string | File | null = f
      ? f.originFileObj
        ? rcToFile(f.originFileObj)
        : (f.url ?? f.thumbUrl ?? null)
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
              <Image
                src={previewThumbUrls[i]}
                alt={`썸네일 ${i + 1}`}
                fill
                className={styles.thumbnail}
              />
            ) : (
              // <img
              // />
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
            <Image
              src={previewCoverUrl}
              alt="커버 이미지"
              fill
              className={styles.thumbnail}
            />
          ) : (
            // <img
            // />
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
