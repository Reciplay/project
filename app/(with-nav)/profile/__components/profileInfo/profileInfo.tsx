"use client";

import { useEditProfile } from "@/hooks/profile/useEditProfile";
import styles from "./profileInfo.module.scss";

interface ProfileInfoProps {
  name: string;
  job: string;
  email: string;
  birth: string;
  gender: number;
  onUpdate?: (newData: Partial<ProfileInfoProps>) => void;
}

export default function ProfileInfo({
  name,
  job,
  email,
  birth,
  gender,
  onUpdate,
}: ProfileInfoProps) {
  const { isEditing, form, error, handleChange, toggleEdit, saveProfile } =
    useEditProfile(
      {
        name,
        job,
        birth,
        gender,
      },
      onUpdate
    );

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.heading}>기본 정보</div>
        <button
          className={styles.editButton}
          onClick={isEditing ? saveProfile : toggleEdit}
        >
          {isEditing ? "✅ 저장" : "✏️ 수정"}
        </button>
      </div>

      {/* 내용 영역 */}
      <div className={styles.section}>
        <div className={styles.title}>이메일</div>
        <div className={styles.value}>{email}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>이름</div>
        {isEditing ? (
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        ) : (
          <div className={styles.value}>{name}</div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.title}>직업</div>
        {isEditing ? (
          <input
            type="text"
            value={form.job}
            onChange={(e) => handleChange("job", e.target.value)}
          />
        ) : (
          <div className={styles.value}>{job}</div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.title}>생년월일</div>
        {isEditing ? (
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
          />
        ) : (
          <div className={styles.value}>{birth}</div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.title}>성별</div>
        {isEditing ? (
          <select
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="0">남성</option>
            <option value="1">여성</option>
          </select>
        ) : (
          <div className={styles.value}>{gender === 0 ? "남성" : "여성"}</div>
        )}
      </div>
    </div>
  );
}
