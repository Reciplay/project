"use client";

import CustomButton from "@/components/button/customButton";
import CustomDatePicker from "@/components/calendar/customDatePicker";
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
        <CustomDatePicker
          value={birthDate}
          onChange={(val) => setBirthDate(val)}
          placeholder="생년월일"
        />
      </div>

      <div className={styles.buttonWrapper}>
        <CustomButton
          title="이메일 찾기"
          onClick={handleFindEmail}
          size="inf"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {emails.length > 0 && (
        <ul className={styles.emailList}>
          {emails.map((email, idx) => (
            <li key={idx} className={styles.email}>
              {email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
