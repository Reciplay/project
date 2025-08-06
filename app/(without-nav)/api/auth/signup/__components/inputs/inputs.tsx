"use client";

import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import { formData } from "@/config/formData";
import useSignUp from "@/hooks/auth/useSignUp";
import styles from "./inputs.module.scss";

export default function Inputs() {
  const {
    register,
    errors,
    watchedNickname,
    watchedEmail,
    watchedConfirm,
    debouncedCheckNickname,
    debouncedCheckEmail,
    checkedNickname,
    checkedEmail,
    nicknameMessage,
    emailMessage,
    isEmailVerified,
    handleSendEmail,
    handleVerifyCode,
    passwordSuccessMessage,
    passwordErrorMessage,
    nicknameErrorMessage,
    nicknameSuccessMessage,
    emailErrorMessage,
    emailSuccessMessage,
  } = useSignUp();

  return (
    <div className={styles.inputs}>
      {/* 닉네임 */}
      <CustomInput
        placeholder={formData.nickname.placeholder}
        type="text"
        {...register("nickname", formData.nickname.rules)}
        error={errors.nickname?.message || nicknameErrorMessage}
        success={nicknameSuccessMessage}
      />

      {/* 이메일 + 전송 */}
      <div className={styles.inputWithButton}>
        <CustomInput
          placeholder={formData.email.placeholder}
          type="email"
          {...register("email", formData.email.rules)}
          error={errors.email?.message || emailErrorMessage}
          success={emailSuccessMessage}
        />
        <BaseButton
          title="전송"
          type="button"
          onClick={handleSendEmail}
          size="lg"
          className={styles.checkButton}
        />
      </div>

      {/* 인증번호 + 인증 */}
      <CustomInput
        placeholder="인증번호"
        type="text"
        {...register("confirmEmail", {
          required: "인증번호는 필수입니다.",
        })}
        error={errors.confirmEmail?.message}
      />

      {/* 비밀번호 */}
      <CustomInput
        {...register("password", formData.password.rules)}
        placeholder={formData.password.placeholder}
        type={formData.password.type}
        error={errors.password?.message}
      />

      {/* 비밀번호 확인 */}
      <CustomInput
        {...register("confirmPassword", {
          required: "비밀번호 확인은 필수입니다.",
        })}
        placeholder="비밀번호 확인"
        type="password"
        error={passwordErrorMessage}
        success={passwordSuccessMessage}
      />
    </div>
  );
}
