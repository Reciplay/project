// _components/SignupForm.tsx
"use client";

/*
  회원가입 폼 (RHF 미사용)
  - 상태/검증/중복체크/전송은 useSignUpPlain 훅에 몰아넣음
  - 이 컴포넌트는 컨트롤드 인풋만 렌더링
*/

import CustomButton from "@/components/button/customButton";
import CustomInput from "@/components/input/customInput";
import { AUTH } from "@/config/const";
import useSignUp from "@/hooks/auth/useSignUp";
import styles from "../../page.module.scss";

export default function SignupFormComponent() {
  const {
    values,
    errors,
    setField,
    signup,
    flushEmail,
    flushNickname,
    sendingEmail,
    handleSendEmail,
    submitting,
    // 노출 메시지
    nicknameErrorMessage,
    nicknameSuccessMessage,
    emailErrorMessage,
    emailSuccessMessage,
    passwordErrorMessage,
    passwordSuccessMessage,
  } = useSignUp();

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        signup();
      }}
      noValidate
      aria-live="polite"
    >
      {/* 닉네임 */}
      <CustomInput
        placeholder="닉네임"
        type="text"
        value={values.nickname}
        onChange={(e) => setField("nickname", e.currentTarget.value)}
        error={errors.nickname || nicknameErrorMessage}
        success={nicknameSuccessMessage}
        aria-invalid={!!errors.nickname}
        onBlur={flushNickname}
      />

      {/* 이메일 + 전송 */}
      <div className={styles.inputWithButton}>
        <CustomInput
          placeholder="이메일"
          type="email"
          value={values.email}
          onChange={(e) => setField("email", e.currentTarget.value)}
          error={errors.email || emailErrorMessage}
          success={emailSuccessMessage}
          aria-invalid={!!errors.email}
          onBlur={flushEmail}
        />
        <CustomButton
          title={sendingEmail ? "전송 중..." : "전송"}
          type="button"
          onClick={handleSendEmail}
          size="lg"
          className={styles.checkButton}
          // disabled={sendingEmail || submitting}
        />
      </div>

      {/* 인증번호 */}
      <CustomInput
        placeholder="인증번호"
        type="text"
        value={values.confirmEmail}
        onChange={(e) => setField("confirmEmail", e.currentTarget.value)}
        error={errors.confirmEmail}
        aria-invalid={!!errors.confirmEmail}
      />

      {/* 비밀번호 */}
      <CustomInput
        placeholder="비밀번호"
        type="password"
        value={values.password}
        onChange={(e) => setField("password", e.currentTarget.value)}
        error={errors.password || passwordErrorMessage}
        success={passwordSuccessMessage}
        aria-invalid={!!errors.password}
      />

      {/* 비밀번호 확인 */}
      <CustomInput
        placeholder="비밀번호 확인"
        type="password"
        value={values.confirmPassword}
        onChange={(e) => setField("confirmPassword", e.currentTarget.value)}
        error={errors.confirmPassword}
        aria-invalid={!!errors.confirmPassword}
      />

      <CustomButton
        title={submitting ? "처리 중..." : AUTH.SIGNUP}
        type="submit"
        size="inf"
      />
    </form>
  );
}
