"use client";

import { User } from "@/types/user";
import styles from "./profileInfo.module.scss";

export interface EditForm {
  name: string;
  job: string;
  birthDate: string;
  gender: number;
}
interface ProfileInfoProps {
  userData: User;
  form: EditForm;
  isEditing: boolean;
  error: string;
  handleChange: (field: string, value: string) => void;
  toggleEdit: () => void;
  saveProfile: () => void;
}

export default function ProfileInfo({
  userData,
  form,
  isEditing,
  error,
  handleChange,
  toggleEdit,
  saveProfile,
}: ProfileInfoProps) {
  // const {
  //   userData,
  //   form,
  //   isEditing,
  //   error,
  //   handleChange,
  //   saveProfile,
  //   toggleEdit,
  // } = useProfile();

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
        <div className={styles.value}>{userData?.email}</div>
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
          <div className={styles.value}>{userData?.name}</div>
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
          <div className={styles.value}>{userData?.job}</div>
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
          <div className={styles.value}>{userData?.birthDate}</div>
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
          <div className={styles.value}>
            {userData?.gender === 0 ? "남성" : "여성"}
          </div>
        )}
      </div>
    </div>
  );
}
