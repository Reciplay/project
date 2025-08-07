"use client";

import Image from "next/image";
import { useState } from "react";
import ProfileImageModal from "../profileImageModal/profileImageModal";
import styles from "./profileHeader.module.scss";

interface ProfileHeaderProps {
  profileUrl: string | null;
  name: string;
  nickname: string;
  job: string;
}

export default function ProfileHeader({
  profileUrl,
  name,
  nickname,
  job,
}: ProfileHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (file: File) => {
    console.log("선택된 이미지 파일:", file);
    // TODO: 이미지 업로드 로직 (API 호출 및 상태 갱신 등)
    setIsModalOpen(false);
  };

  return (
    <div
      className={styles.container}
      style={
        profileUrl ? { backgroundImage: `url("${profileUrl}")` } : undefined
      }
    >
      <div className={styles.profileContainer}>
        <div
          className={styles.profileImageWrapper}
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={profileUrl || "/images/default_profile.jpg"}
            alt="profile"
            fill
            className={styles.profileImage}
          />
        </div>
      </div>

      <div className={`${styles.textContainer} ${styles.glassBox}`}>
        <div className={styles.name}>{nickname}</div>
        <div className={styles.tags}>
          <span>#{name} </span>
          <span>#{job}</span>
        </div>
      </div>
      {/* ✅ 모달 컴포넌트 */}
      <ProfileImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profileUrl={profileUrl || "/images/default_profile.jpg"}
        onFileChange={handleFileChange}
      />
    </div>
  );
}
