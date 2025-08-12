// ThumbNailForm.tsx
"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";
import styles from "./thumbnailForm.module.scss";

export default function ThumbNailForm() {
  const [images, setImages] = useState<UploadFile[]>([]);

  const uploadProps: UploadProps = {
    name: "thumbnail_files",
    multiple: true,
    listType: "picture",
    fileList: images,
    action: "https://your-upload-api-endpoint.com/upload",

    onChange(info) {
      const newFileList = [...info.fileList];
      setImages(newFileList);

      if (info.file.status === "done") {
        message.success(`${info.file.name} 파일 업로드 성공`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 파일 업로드 실패.`);
      }
    },

    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("JPG/PNG 파일만 업로드 가능합니다!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("이미지 크기는 2MB 이하여야 합니다!");
      }
      return isJpgOrPng && isLt2M;
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>미리보기</div>
      <div className={styles.previewContainer}>
        {[0, 1, 2].map((index) => {
          const file = images[index];
          const imageUrl =
            file?.thumbUrl ||
            (file?.originFileObj
              ? URL.createObjectURL(file.originFileObj)
              : null);

          return imageUrl ? (
            <div key={index} className={styles.thumbnailCard}>
              <img
                src={imageUrl}
                alt={`썸네일 ${index + 1}`}
                className={styles.thumbnail}
              />
            </div>
          ) : (
            <div
              key={index}
              className={`${styles.thumbnailCard} ${styles.placeholder}`}
            >
              <span>이미지를 업로드하세요</span>
            </div>
          );
        })}
      </div>

      <div className={styles.uploadSection}>
        <Upload {...uploadProps} showUploadList={false}>
          <Button icon={<UploadOutlined />} className={styles.uploadButton}>
            <span>강좌 썸네일 등록하기</span>
          </Button>
        </Upload>
      </div>
    </div>
  );
}
