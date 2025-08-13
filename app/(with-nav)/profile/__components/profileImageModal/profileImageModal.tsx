"use client";

import CustomModal from "@/components/modal/customModal";
import { User } from "@/types/user";
import Image from "next/image";
import { RefObject } from "react";
import styles from "./profileImageModal.module.scss";

interface ProfileImageModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  previewUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProfileImage: () => void;
  selectedFile: File | null;
  userData: User;
}

export default function ProfileImageModal({
  isModalOpen,
  setIsModalOpen,
  previewUrl,
  fileInputRef,
  handleFileSelect,
  uploadProfileImage,
  selectedFile,
  userData,
}: ProfileImageModalProps) {
  return (
    <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className={styles.modalContent}>
        <div className={styles.imageWrapper}>
          <Image
            src={
              previewUrl ||
              userData?.profileImage?.presignedUrl ||
              "/images/default_profile.jpg"
            }
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
          onClick={uploadProfileImage}
          disabled={!selectedFile}
        >
          프로필 이미지 변경
        </button>
      </div>
    </CustomModal>
  );
}
