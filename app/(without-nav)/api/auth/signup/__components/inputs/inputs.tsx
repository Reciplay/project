"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import styles from "./inputs.module.scss";
import { SignupForm } from "@/app/(without-nav)/api/auth/signup/page";
import useSignupValidation from "@/hooks/useSignupValidation";
import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import { debounce } from "lodash";
import { formData } from "@/config/formData";
import useAuth from "@/hooks/auth/useAuth";
import { useDuplicateCheck } from "@/hooks/useDuplicateCheck";

export default function Inputs() {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<SignupForm>();

  const watchedNickname = useWatch({ name: "nickname" });
  const watchedEmail = useWatch({ name: "email" });
  const watchedConfirm = useWatch({ name: "confirmEmail" });

  const {
    checkedValue: checkedEmail,
    message: emailMessage,
    debouncedCheck: debouncedCheckEmail,
  } = useDuplicateCheck("email");

  const {
    checkedValue: checkedNickname,
    message: nicknameMessage,
    debouncedCheck: debouncedCheckNickname,
  } = useDuplicateCheck("nickname");

  return (
    <div className={styles.inputs}>
      {/* 닉네임 */}
      <CustomInput
        placeholder={formData.nickname.placeholder}
        type="text" // "nickname" → "text"
        {...register("nickname", formData.nickname.rules)} // react-hook-form용
        onChange={(e) => {
          debouncedCheckNickname(e.target.value);
        }}
        error={errors.nickname?.message}
        success={
          watchedNickname &&
          checkedNickname === watchedNickname &&
          !errors.nickname
            ? nicknameMessage
            : undefined
        }
      />

      {/* 이메일 + 전송 */}
      <div className={styles.inputWithButton}>
        <CustomInput
          placeholder={formData.email.placeholder}
          type="email"
          {...register("email", formData.email.rules)}
          onChange={(e) => {
            debouncedCheckEmail(e.target.value);
          }}
          error={errors.email?.message}
          success={
            watchedEmail && checkedEmail === watchedEmail && !errors.email
              ? emailMessage
              : undefined
          }
        />

        <BaseButton
          title="전송"
          type="button"
          // onClick={handleSendEmail}
          size="lg"
          className={styles.checkButton}
        />
      </div>

      {/* 인증번호 + 인증 */}
      <div className={styles.inputWithButton}>
        <CustomInput
          placeholder="인증번호"
          type="text"
          {...register("confirmEmail", {
            required: "인증번호는 필수입니다.",
          })}
          error={errors.confirmEmail?.message}
          success={
            watchedConfirm && !errors.confirmEmail
              ? "이메일 인증이 완료되었습니다."
              : undefined
          }
        />
        <BaseButton
          title="인증"
          type="button"
          // onClick={handleVerifyCode}
          size="lg"
          className={styles.checkButton}
        />
      </div>

      {/* 비밀번호 */}
      <CustomInput
        {...register("password", formData.password.rules)}
        placeholder={formData.password.placeholder}
        type={formData.password.type}
        error={errors.password?.message}
      />

      {/* 비밀번호 확인 */}
      <CustomInput
        {...register("password", formData.password.rules)}
        placeholder={formData.password.placeholder}
        type={formData.password.type}
        error={errors.password?.message}
      />
    </div>
  );
}
