"use client";

import CustomButton from "@/components/button/customButton";
import CustomInput from "@/components/input/customInput";
import { formData } from "@/config/formData";
import { SignupForm } from "@/types/user";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import styles from "./inputs.module.scss";

export interface InputsProps {
  register: UseFormRegister<SignupForm>;
  errors: FieldErrors<SignupForm>;
  // 메시지
  nicknameErrorMessage?: string;
  nicknameSuccessMessage?: string;
  emailErrorMessage?: string;
  emailSuccessMessage?: string;
  passwordErrorMessage?: string;
  passwordSuccessMessage?: string;
  // 액션
  onSendEmail: () => Promise<void> | void;
  sendingEmail?: boolean;
  isSubmitting?: boolean;
}

export default function Inputs({
  register,
  errors,
  nicknameErrorMessage,
  nicknameSuccessMessage,
  emailErrorMessage,
  emailSuccessMessage,
  passwordErrorMessage,
  passwordSuccessMessage,
  onSendEmail,
  sendingEmail,
}: InputsProps) {
  return (
    <div className={styles.inputs} aria-live="polite">
      {/* 닉네임 */}
      <CustomInput
        placeholder={formData.nickname.placeholder}
        type="text"
        {...register("nickname", formData.nickname.rules)}
        error={errors.nickname?.message || nicknameErrorMessage}
        success={nicknameSuccessMessage}
        aria-invalid={!!errors.nickname}
      />

      {/* 이메일 + 전송 */}
      <div className={styles.inputWithButton}>
        <CustomInput
          placeholder={formData.email.placeholder}
          type="email"
          {...register("email", formData.email.rules)}
          error={errors.email?.message || emailErrorMessage}
          success={emailSuccessMessage}
          aria-invalid={!!errors.email}
        />
        <CustomButton
          title={sendingEmail ? "전송 중..." : "전송"}
          type="button"
          onClick={onSendEmail}
          size="lg"
          className={styles.checkButton}
          // 비활성화 처리
          // disabled={sendingEmail || isSubmitting}
          // variant="link" 등도 가능
        />
      </div>

      {/* 인증번호 */}
      <CustomInput
        placeholder="인증번호"
        type="text"
        {...register("confirmEmail", { required: "인증번호는 필수입니다." })}
        error={errors.confirmEmail?.message}
        aria-invalid={!!errors.confirmEmail}
      />

      {/* 비밀번호 */}
      <CustomInput
        {...register("password", formData.password.rules)}
        placeholder={formData.password.placeholder}
        type={formData.password.type}
        error={errors.password?.message || passwordErrorMessage}
        success={passwordSuccessMessage}
        aria-invalid={!!errors.password}
      />

      {/* 비밀번호 확인 */}
      <CustomInput
        {...register("confirmPassword", {
          required: "비밀번호 확인은 필수입니다.",
        })}
        placeholder="비밀번호 확인"
        type="password"
        error={errors.confirmPassword?.message}
        aria-invalid={!!errors.confirmPassword}
      />
    </div>
  );
}
