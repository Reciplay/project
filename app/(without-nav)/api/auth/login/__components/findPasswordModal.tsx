"use client";

import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import { useFindPassword } from "@/hooks/auth/useFindPassword";
import styles from "./findEmailModal.module.scss"; // 동일한 SCSS 사용

export default function FindPasswordModal() {
  const {
    step,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    error,
    requestOtp,
    verifyOtp,
    changePassword,
  } = useFindPassword();

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.title}>비밀번호 재설정</h2>

      {step === 1 && (
        <>
          <div className={styles.inputWrapper}>
            <CustomInput
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <BaseButton title="인증번호 받기" onClick={requestOtp} size="inf" />
        </>
      )}

      {step === 2 && (
        <>
          <div className={styles.inputWrapper}>
            <CustomInput
              type="text"
              placeholder="인증번호"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <BaseButton title="인증하기" onClick={verifyOtp} size="inf" />
        </>
      )}

      {step === 3 && (
        <>
          <div className={styles.inputWrapper}>
            <CustomInput
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <BaseButton
            title="비밀번호 변경"
            onClick={changePassword}
            size="inf"
          />
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
