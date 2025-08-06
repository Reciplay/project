"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./profileImageModal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profileUrl: string;
  onFileChange: (file: File) => void;
}

export default function ProfileImageModal({
  isOpen,
  onClose,
  profileUrl,
  onFileChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.imageWrapper}>
          <Image
            src={profileUrl}
            alt="profile preview"
            fill
            className={styles.profileImage}
          />
        </div>

        <label className={styles.fileInputLabel}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            hidden
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            파일 선택
          </button>
          <span className={styles.filename}>
            {selectedFile ? selectedFile.name : "선택된 파일 없음"}
          </span>
        </label>

        <button
          className={styles.confirmButton}
          onClick={handleUploadClick}
          disabled={!selectedFile}
        >
          프로필 이미지 변경
        </button>
      </div>
    </div>
  );
}
