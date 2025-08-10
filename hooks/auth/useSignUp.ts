"use client";

import { ROUTES } from "@/config/routes";
import restClient from "@/lib/axios/restClient";
import type { ApiResponse } from "@/types/apiResponse";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDuplicateCheck } from "./useDuplicateCheck";

export interface SignupValues {
  nickname: string;
  email: string;
  confirmEmail: string; // 이메일 OTP 입력칸
  password: string;
  confirmPassword: string;
}

export interface SignupErrors {
  nickname?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
}

export default function useSignUp(initial?: Partial<SignupValues>) {
  const router = useRouter();

  // 폼 상태
  const [values, setValues] = useState<SignupValues>({
    nickname: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    ...initial,
  });

  const [errors, setErrors] = useState<SignupErrors>({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 중복 체크 훅
  const {
    checkedValue: checkedEmail,
    message: emailMessage,
    debouncedCheck: debouncedCheckEmail,
    ok: isEmailValid,
    flushCheck: flushEmail,
  } = useDuplicateCheck("email");

  const {
    checkedValue: checkedNickname,
    message: nicknameMessage,
    debouncedCheck: debouncedCheckNickname,
    ok: isNicknameValid,
    flushCheck: flushNickname,
  } = useDuplicateCheck("nickname");

  // 입력 변경자 (필드 단위)
  const setField = <K extends keyof SignupValues>(
    key: K,
    val: SignupValues[K]
  ) => {
    setValues((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));

    if (key === "email") {
      const v = String(val).trim();
      // 형식 가드 (불필요한 콜 방지)
      if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return;
      debouncedCheckEmail(v);
    }

    if (key === "nickname") {
      const v = String(val).trim();
      if (!v || v.length < 2) return;
      debouncedCheckNickname(v);
    }
  };

  // 비밀번호 일치/불일치 메시지 (원래 훅과 동일한 의미)
  const passwordSuccessMessage = useMemo(() => {
    return values.password &&
      values.confirmPassword &&
      values.password === values.confirmPassword
      ? "비밀번호가 일치합니다."
      : undefined;
  }, [values.password, values.confirmPassword]);

  const passwordErrorMessage =
    values.confirmPassword && values.password !== values.confirmPassword
      ? "비밀번호가 일치하지 않습니다."
      : undefined;

  // 닉네임/이메일 디바운스 중복체크 (원래 훅 로직 유지)
  useEffect(() => {
    if (!values.nickname) return;
    debouncedCheckNickname(values.nickname);
  }, [values.nickname, debouncedCheckNickname]);

  useEffect(() => {
    if (!values.email) return;
    debouncedCheckEmail(values.email);
  }, [values.email, debouncedCheckEmail]);

  // 메시지(성공/에러) 구성 (원래 변수명 유지)
  const nicknameSuccessMessage =
    values.nickname && isNicknameValid && checkedNickname === values.nickname
      ? nicknameMessage
      : undefined;

  const nicknameErrorMessage =
    values.nickname && (!isNicknameValid || checkedNickname !== values.nickname)
      ? nicknameMessage
      : undefined;

  const emailSuccessMessage =
    values.email && isEmailValid && checkedEmail === values.email
      ? emailMessage
      : undefined;

  const emailErrorMessage =
    values.email && (!isEmailValid || checkedEmail !== values.email)
      ? emailMessage
      : undefined;

  // 인증 메일 전송 (원래 handleSendEmail)
  const handleSendEmail = async () => {
    if (!values.email) {
      setErrors((p) => ({ ...p, email: "이메일을 먼저 입력해주세요." }));
      return;
    }
    try {
      setSendingEmail(true);
      const res = await restClient.get("/user/auth/mail-otp", {
        params: { email: values.email },
      });
      if (res.status === 200) alert("인증번호가 전송되었습니다.");
    } catch {
      alert("인증번호 전송 실패");
    } finally {
      setSendingEmail(false);
    }
  };

  // 인증 코드 확인 (원래 handleVerifyCode)
  const handleVerifyCode = async (): Promise<string | null> => {
    if (!values.email || !values.confirmEmail) {
      setErrors((p) => ({
        ...p,
        email:
          p.email ?? (!values.email ? "이메일을 입력해주세요." : undefined),
        confirmEmail: !values.confirmEmail
          ? "인증번호를 입력해주세요."
          : undefined,
      }));
      return null;
    }
    try {
      setVerifyingEmail(true);
      const res = await restClient.get("/user/auth/mail-verification", {
        params: { email: values.email, otp: values.confirmEmail },
      });
      if (res.status === 200) {
        alert("이메일 인증 완료");
        setIsEmailVerified(true);
        return res.data.data.hash as string;
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch {
      alert("이메일 인증 실패");
    } finally {
      setVerifyingEmail(false);
    }
    return null;
  };

  // 제출 (원래 signup과 동일 동작; RHF data 대신 로컬 values 사용)
  const signup = async () => {
    // 간단 클라이언트 검증
    const next: SignupErrors = {};
    if (!values.nickname) next.nickname = "닉네임은 필수입니다.";
    if (!values.email) next.email = "이메일은 필수입니다.";
    if (!values.password) next.password = "비밀번호는 필수입니다.";
    if (!values.confirmPassword)
      next.confirmPassword = "비밀번호 확인은 필수입니다.";
    if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      next.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    const otp = await handleVerifyCode();
    if (!otp) return;

    try {
      setSubmitting(true);
      const res = await restClient.post<ApiResponse<object>>(
        "/user/auth/signup",
        {
          email: values.email,
          password: values.password,
          nickname: values.nickname,
          hash: otp,
        }
      );

      if (res.status === 201) {
        alert("회원가입 성공!");
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        router.push(ROUTES.AUTH.EXTRA);
      } else {
        alert("회원가입 실패");
      }
    } catch {
      alert("서버 오류 발생");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // 값/에러/상태
    values,
    errors,
    isEmailVerified,
    sendingEmail,
    verifyingEmail,
    submitting,

    // 액션
    setField,
    flushEmail, // ⬅️ onBlur에 연결해서 즉시 실행
    flushNickname, // ⬅️ onBlur에 연결해서 즉시 실행
    handleSendEmail,
    handleVerifyCode,
    signup,

    // 메시지 (원래 네이밍 유지)
    passwordSuccessMessage,
    passwordErrorMessage,
    nicknameErrorMessage,
    nicknameSuccessMessage,
    emailErrorMessage,
    emailSuccessMessage,
  };
}
