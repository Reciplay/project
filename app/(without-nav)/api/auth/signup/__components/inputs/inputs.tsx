"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import styles from "./inputs.module.scss";
import { SignupForm } from "@/app/(without-nav)/api/auth/signup/page";
import useSignupValidation from "@/hooks/useSignupValidation";
import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import { debounce } from "lodash";

export default function Inputs() {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<SignupForm>();

  const { checkNickname, checkEmailDuplicate, sendEmail, verifyCode } =
    useSignupValidation();

  // ------------------------
  // 1) useWatch 훅은 최상단에 한 번만!
  const watchedNickname = useWatch({ name: "nickname" });
  const watchedEmail = useWatch({ name: "email" });
  const watchedConfirm = useWatch({ name: "confirmEmail" });
  // ------------------------

  const [checkedNickname, setCheckedNickname] = useState("");
  const [checkedEmail, setCheckedEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  // debounce 로 500ms 이후에 한 번만 실행되도록
  const debouncedCheckNickname = useMemo(
    () =>
      debounce((val: string) => {
        checkNickname(val).then((msg) => {
          if (msg === "사용 가능한 닉네임입니다.") {
            setCheckedNickname(val);
          }
        });
      }, 500),
    [checkNickname]
  );

  const debouncedCheckEmail = useMemo(
    () =>
      debounce((val: string) => {
        checkEmailDuplicate(val, (ok) => {
          if (ok) setCheckedEmail(val);
        });
      }, 500),
    [checkEmailDuplicate]
  );

  // register 분해
  const {
    onChange: onNickChangeRH,
    onBlur: onNickBlurRH,
    ...nickRest
  } = register("nickname", {
    required: "닉네임은 필수입니다.",
    minLength: { value: 5, message: "5자 이상 입력하세요." },
    maxLength: { value: 10, message: "10자 이내여야 합니다." },
    pattern: {
      value: /^[a-zA-Z0-9가-힣]+$/,
      message: "한글, 숫자, 영어만 사용 가능",
    },
  });

  const {
    onChange: onEmailChangeRH,
    onBlur: onEmailBlurRH,
    ...emailRest
  } = register("email", {
    required: "이메일은 필수입니다.",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "유효한 이메일 주소를 입력하세요.",
    },
  });

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onNickChangeRH(e);
    const v = e.target.value;
    if (v.length >= 5) debouncedCheckNickname(v);
    else {
      debouncedCheckNickname.cancel();
      setCheckedNickname("");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    onEmailChangeRH(e);
    const v = e.target.value;
    if (v.length >= 5) debouncedCheckEmail(v);
    else {
      debouncedCheckEmail.cancel();
      setCheckedEmail("");
    }
  };

  const handleSendEmail = async () => {
    await sendEmail();
    setCodeSent(true);
  };
  const handleVerifyCode = async () => {
    await verifyCode();
  };

  const watchedPassword = getValues("password");

  return (
    <div className={styles.inputs}>
      {/* 닉네임 */}
      <CustomInput
        placeholder="닉네임"
        type="text"
        {...nickRest}
        onChange={handleNicknameChange}
        onBlur={onNickBlurRH}
        error={errors.nickname?.message}
        success={
          // 최소 5자 이상 입력했고, 중복 체크를 통과한 값과 같을 때만
          watchedNickname &&
          watchedNickname.length >= 5 &&
          checkedNickname === watchedNickname &&
          !errors.nickname
            ? "사용 가능한 닉네임입니다."
            : undefined
        }
      />

      {/* 이메일 + 전송 */}
      <div className={styles.inputWithButton}>
        <CustomInput
          placeholder="이메일"
          type="email"
          {...emailRest}
          onChange={handleEmailChange}
          onBlur={onEmailBlurRH}
          error={errors.email?.message}
          success={
            codeSent && checkedEmail === watchedEmail && !errors.email
              ? "사용 가능한 이메일입니다."
              : undefined
          }
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
          onClick={handleVerifyCode}
          size="lg"
          className={styles.checkButton}
        />
      </div>

      {/* 비밀번호 */}
      <CustomInput
        placeholder="비밀번호"
        type="password"
        {...register("password", {
          required: "비밀번호는 필수입니다.",
          minLength: { value: 8, message: "8자 이상 입력하세요." },
          maxLength: { value: 20, message: "20자 이하만 가능" },
          pattern: {
            value:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~])/,
            message: "영어+숫자+특수문자 포함",
          },
        })}
        error={errors.password?.message}
      />

      {/* 비밀번호 확인 */}
      <CustomInput
        placeholder="비밀번호 확인"
        type="password"
        {...register("confirmPassword", {
          required: "비밀번호 확인은 필수입니다.",
          validate: (v) =>
            v === watchedPassword || "비밀번호가 일치하지 않습니다.",
        })}
        error={errors.confirmPassword?.message}
      />
    </div>
  );
}
