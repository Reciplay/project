"use client";

import { User } from "@/types/user";
import Image from "next/image";
import { RefObject } from "react";
import ProfileImageModal from "../profileImageModal/profileImageModal";
import styles from "./profileHeader.module.scss";

interface ProfileHeaderProps {
  userData: User;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProfileImage: () => void;
  previewUrl: string | null;
  selectedFile: File | null;
}

export default function ProfileHeader({
  userData,
  isModalOpen,
  setIsModalOpen,
  fileInputRef,
  handleFileSelect,
  uploadProfileImage,
  previewUrl,
  selectedFile,
}: ProfileHeaderProps) {
  return (
    <div
      className={styles.container}
      style={
        userData?.profileImage?.presignedUrl
          ? { backgroundImage: `url("${userData.profileImage.presignedUrl}")` }
          : undefined
      }
    >
      <div className={styles.profileContainer}>
        <div
          className={styles.profileImageWrapper}
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={
              userData.profileImage?.presignedUrl ||
              "/images/default_profile.jpg"
            }
            alt="profile"
            fill
            className={styles.profileImage}
            priority
          />
        </div>
      </div>

      <div className={`${styles.textContainer} ${styles.glassBox}`}>
        <div className={styles.name}>{userData.nickname}</div>
        <div className={styles.tags}>
          <span>#{userData.name} </span>
          <span>#{userData.job}</span>
        </div>
      </div>

      <ProfileImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        previewUrl={previewUrl}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        uploadProfileImage={uploadProfileImage}
        selectedFile={selectedFile}
        userData={userData}
      />
    </div>
  );
}
