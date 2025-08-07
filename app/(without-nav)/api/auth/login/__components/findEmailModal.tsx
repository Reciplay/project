"use client";

import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import { useFindEmail } from "@/hooks/auth/useFindEmail";
import styles from "./findEmailModal.module.scss";

export default function FindEmailModal() {
  const {
    name,
    setName,
    birthDate,
    setBirthDate,
    emails,
    error,
    handleFindEmail,
  } = useFindEmail();

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.title}>이메일 찾기</h2>

      <div className={styles.inputWrapper}>
        <CustomInput
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.inputWrapper}>
        <CustomInput
          type="date"
          placeholder="생년월일"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <BaseButton title="이메일 찾기" onClick={handleFindEmail} size="inf" />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {emails.length > 0 && (
        <ul className={styles.emailList}>
          {emails.map((email, idx) => (
            <li key={idx}>{email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
