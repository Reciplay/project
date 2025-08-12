// __components/forms/thumbnailForm.tsx
"use client";

import { useCreateCourseStore } from "@/hooks/course/useCreateCourseStore";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./thumbnailForm.module.scss";

// ✅ 스토어가 허용하는 필드로 좁히기
type ThumbField = "thumbnailImages";
type CoverField = "courseCoverImage";

interface Props {
  thumbnailName?: ThumbField; // 기본값 지원
  coverName?: CoverField;
}

export default function ThumbNailForm({
  thumbnailName = "thumbnailImages",
  coverName = "courseCoverImage",
}: Props) {
  const { values, errors, setField } = useCreateCourseStore();

  const [thumbList, setThumbList] = useState<UploadFile[]>([]);
  const [coverList, setCoverList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const thumbs = (values.thumbnailImages ?? []) as (File | string)[];
    const createdURLs: string[] = [];

    const mappedThumbs: UploadFile[] = thumbs.map((item, idx) => {
      if (typeof item === "string") {
        return {
          uid: `thumb-url-${idx}`,
          name: `thumb-${idx}`,
          status: "done",
          url: item,
        };
      } else {
        const url = URL.createObjectURL(item);
        createdURLs.push(url);
        return {
          uid: `thumb-file-${idx}`,
          name: item.name ?? `thumb-${idx}`,
          status: "done",
          url,
        };
      }
    });
    setThumbList(mappedThumbs);

    const cover = values.courseCoverImage as File | string | null;
    let coverMapped: UploadFile[] = [];
    if (cover) {
      if (typeof cover === "string") {
        coverMapped = [
          { uid: "cover-url", name: "cover", status: "done", url: cover },
        ];
      } else {
        const url = URL.createObjectURL(cover);
        createdURLs.push(url);
        coverMapped = [
          {
            uid: "cover-file",
            name: cover.name ?? "cover",
            status: "done",
            url,
          },
        ];
      }
    }
    setCoverList(coverMapped);

    return () => {
      createdURLs.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [values.thumbnailImages, values.courseCoverImage]);

  const previewThumbUrls = useMemo(() => {
    return thumbList
      .slice(0, 3)
      .map(
        (f) =>
          f.thumbUrl ||
          f.url ||
          (f.originFileObj ? URL.createObjectURL(f.originFileObj) : ""),
      );
  }, [thumbList]);

  const previewCoverUrl = useMemo(() => {
    const f = coverList[0];
    return f
      ? f.thumbUrl ||
          f.url ||
          (f.originFileObj ? URL.createObjectURL(f.originFileObj) : "")
      : "";
  }, [coverList]);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isImg = /^image\/(png|jpeg|jpg|webp)$/.test(file.type);
    if (!isImg) {
      message.error("PNG/JPG/WEBP 이미지 파일만 업로드 가능합니다.");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("이미지 크기는 2MB 이하여야 합니다.");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  // 썸네일 여러 개
  const onChangeThumbs: UploadProps["onChange"] = (info) => {
    const list = info.fileList;
    setThumbList(list);

    const filesOrUrls = list
      .map((f) =>
        f.originFileObj
          ? (f.originFileObj as File)
          : (f.url ?? f.thumbUrl ?? ""),
      )
      .filter(Boolean) as (File | string)[]; // ✅ 값 타입도 명확히
    setField(thumbnailName, filesOrUrls);
  };

  // 커버 1개
  const onChangeCover: UploadProps["onChange"] = (info) => {
    const list = info.fileList.slice(-1);
    setCoverList(list);

    const f = list[0];
    const fileOrUrl = f
      ? ((f.originFileObj as File) ?? f.url ?? f.thumbUrl ?? "")
      : null;
    setField(coverName, fileOrUrl as File | string | null);
  };

  const errThumbs = errors[thumbnailName];
  const errCover = errors[coverName];
  return (
    <div className={styles.container}>
      <div className={styles.title}>미리보기</div>

      {/* 미리보기 3칸 (썸네일) + 1칸(커버) 예시 */}
      <div className={styles.previewContainer}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${styles.thumbnailCard} ${!previewThumbUrls[i] ? styles.placeholder : ""}`}
          >
            {previewThumbUrls[i] ? (
              <Image
                src={previewThumbUrls[i]}
                alt={`썸네일 ${i + 1}`}
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
          className={`${styles.thumbnailCard} ${!previewCoverUrl ? styles.placeholder : ""}`}
        >
          {previewCoverUrl ? (
            <Image
              src={previewCoverUrl}
              alt="커버 이미지"
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
        {/* 썸네일 여러 개 */}
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
        {errThumbs && <p className={styles.error}>{String(errThumbs)}</p>}
      </div>

      <div className={styles.uploadSection}>
        {/* 커버 1개 */}
        <Upload
          accept="image/*"
          maxCount={1}
          listType="picture"
          fileList={coverList}
          beforeUpload={beforeUpload}
          onChange={onChangeCover}
          showUploadList
        >
          <Button icon={<UploadOutlined />} className={styles.uploadButton}>
            <span>강좌 커버 등록하기</span>
          </Button>
        </Upload>
        {errCover && <p className={styles.error}>{String(errCover)}</p>}
      </div>
    </div>
  );
}
