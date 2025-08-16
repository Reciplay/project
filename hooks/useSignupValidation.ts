"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { SignupForm } from "@/types/user";
import { useFormContext } from "react-hook-form";

export default function useSignupValidation() {
  const { setError, clearErrors, getValues } = useFormContext<SignupForm>();

  const checkNickname = async (nickname: string): Promise<string> => {
    if (!nickname || nickname.length < 5) {
      clearErrors("nickname");
      return "닉네임을 5자 이상 입력하세요.";
    }

    const regex = /^[a-zA-Z0-9가-힣]+$/;
    if (!regex.test(nickname)) {
      setError("nickname", { message: "한글, 숫자, 영어만 사용 가능" });
      return "닉네임은 한글, 숫자, 영어만 사용 가능합니다.";
    }

    try {
      const res = await restClient.get<ApiResponse<object>>(
        "/user/auth/dup-nickname",
        {
          params: nickname,
        },
      );
      const isDuplicated = res.data.data;

      if (isDuplicated) {
        const msg = "이미 사용 중인 닉네임입니다.";
        setError("nickname", { message: msg });
        return msg;
      } else {
        const msg = "사용 가능한 닉네임입니다.";
        clearErrors("nickname");
        return msg;
      }
    } catch (err) {
      console.error("닉네임 확인 중 오류:", err);
      const msg = "중복 확인 실패, 새로 고침해주세요.";
      setError("nickname", { message: msg });
      return msg;
    }
  };

  const checkEmailDuplicate = async (
    email: string,
    onAvailable?: (_available: boolean) => void,
  ) => {
    if (!email || email.length < 5) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    try {
      const res = await restClient.get<ApiResponse<boolean>>(
        `/user/auth/dup-email`,
        { params: { email } },
      );

      const isDuplicated = res.data.data;

      if (isDuplicated) {
        setError("email", { message: "이미 등록된 이메일입니다." });
        onAvailable?.(false);
      } else {
        clearErrors("email");
        onAvailable?.(true);
      }
    } catch (err) {
      console.error("이메일 중복 확인 중 오류:", err);
    }
  };

  const sendEmail = async () => {
    const email = getValues("email");
    if (!email) return alert("이메일을 입력하세요.");

    try {
      const res = await fetch(`/api/send-code?email=${email}`);
      if (res.ok) {
        alert("인증번호가 전송되었습니다.");
      } else {
        alert("이메일 전송 실패");
      }
    } catch {
      alert("이메일 전송 중 오류 발생");
    }
  };

  const verifyCode = async () => {
    const email = getValues("email");
    const code = getValues("confirmEmail");
    if (!code) return alert("인증번호를 입력하세요.");

    try {
      const res = await fetch(`/api/verify-code?email=${email}&code=${code}`);
      const result = await res.json();
      if (result.success) {
        alert("이메일 인증 완료!");
        clearErrors("confirmEmail");
      } else {
        setError("confirmEmail", { message: "인증번호가 일치하지 않습니다." });
      }
    } catch {
      alert("인증 확인 중 오류 발생");
    }
  };

  return {
    checkNickname,
    checkEmailDuplicate,
    sendEmail,
    verifyCode,
  };
}
