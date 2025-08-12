import { ROUTES } from "@/config/routes";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { SignupForm } from "@/types/user";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDuplicateCheck } from "./useDuplicateCheck";

export default function useSignUp() {
  const router = useRouter();
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<SignupForm>();

  const watchedNickname = useWatch({ name: "nickname" });
  const watchedEmail = useWatch({ name: "email" });
  const watchedConfirm = useWatch({ name: "confirmEmail" });
  const watchedPassword = useWatch({ name: "password" });
  const watchedConfirmPassword = useWatch({ name: "confirmPassword" });

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const {
    checkedValue: checkedEmail,
    message: emailMessage,
    debouncedCheck: debouncedCheckEmail,
    ok: isEmailValid,
  } = useDuplicateCheck("email");

  const {
    checkedValue: checkedNickname,
    message: nicknameMessage,
    debouncedCheck: debouncedCheckNickname,
    ok: isNicknameValid,
  } = useDuplicateCheck("nickname");

  // 상태: 성공/에러 메시지  - 완료
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>();
  const [nicknameSuccessMessage, setNicknameSuccessMessage] =
    useState<string>();
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string>();

  // 닉네임 중복 체크  - 완료
  useEffect(() => {
    if (!watchedNickname) {
      setNicknameErrorMessage(undefined);
      setNicknameSuccessMessage(undefined);
      return;
    }

    debouncedCheckNickname(watchedNickname);
  }, [watchedNickname]);

  useEffect(() => {
    if (!watchedNickname) return;

    const isValid =
      isNicknameValid &&
      checkedNickname === watchedNickname &&
      !errors.nickname;

    setNicknameSuccessMessage(isValid ? nicknameMessage : undefined);
    setNicknameErrorMessage(
      !isValid && nicknameMessage ? nicknameMessage : undefined
    );
  }, [
    isNicknameValid,
    checkedNickname,
    watchedNickname,
    nicknameMessage,
    errors.nickname,
  ]);

  useEffect(() => {
    if (!watchedEmail) {
      setEmailErrorMessage(undefined);
      setEmailSuccessMessage(undefined);
      return;
    }

    debouncedCheckEmail(watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    if (!watchedEmail) return;

    const isValid =
      isEmailValid && checkedEmail === watchedEmail && !errors.email;

    setEmailSuccessMessage(isValid ? emailMessage : undefined);
    setEmailErrorMessage(!isValid && emailMessage ? emailMessage : undefined);
  }, [isEmailValid, checkedEmail, watchedEmail, emailMessage, errors.email]);

  // 비밀번호, 비밀번호 확인 일치 - 완료
  const passwordSuccessMessage =
    watchedPassword &&
    watchedConfirmPassword &&
    watchedPassword === watchedConfirmPassword &&
    !errors.confirmPassword
      ? "비밀번호가 일치합니다."
      : undefined;

  // 비밀번호, 비밀번호 확인 불일치 - 완료
  const passwordErrorMessage =
    watchedConfirmPassword && watchedPassword !== watchedConfirmPassword
      ? "비밀번호가 일치하지 않습니다."
      : undefined;

  // 이메일 확인 전송 - 완료
  const handleSendEmail = async () => {
    const email = getValues("email");
    try {
      const res = await restClient.get("/user/auth/mail-otp", {
        params: { email },
      });
      if (res.status === 200) {
        alert("인증번호가 전송되었습니다.");
      }
    } catch {
      alert("인증번호 전송 실패");
    }
  };

  // 이메일 인증 코드 확인 - 완료
  const handleVerifyCode = async (): Promise<string | null> => {
    const email = getValues("email");
    const code = getValues("confirmEmail");

    try {
      const res = await restClient.get("/user/auth/mail-verification", {
        params: { email, otp: code },
      });

      if (res.status === 200) {
        alert("이메일 인증 완료");
        setIsEmailVerified(true);
        return res.data.data.hash; // ✅ 실질 사용용
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch {
      alert("이메일 인증 실패");
    }

    return null;
  };

  const signup = async (data: SignupForm, otp: string) => {
    // 로그인 시도 ->
    // 비밀번호 일치 시
    // 이메일 인증 통과
    // 닉네임 중복 통과
    // 이메일 중복 통과
    try {
      const res = await restClient.post<ApiResponse<object>>(
        "/user/auth/signup",
        {
          email: data.email,
          password: data.password,
          nickname: data.nickname,
          hash: otp,
        }
      );

      if (res.status === 201) {
        alert("회원가입 성공!");
        // 회원 가입 성공 시 바로 로그인 시도 + 추가정보 기입 페이지로 이동
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        router.push(ROUTES.AUTH.EXTRA);
      } else {
        alert("회원가입 실패");
      }
    } catch (error) {
      alert("서버 오류 발생");
      console.log();
    }
  };
  return {
    register,
    errors,
    watchedNickname,
    watchedEmail,
    watchedConfirm,
    watchedPassword,
    watchedConfirmPassword,
    checkedEmail,
    emailMessage,
    debouncedCheckEmail,
    checkedNickname,
    nicknameMessage,
    debouncedCheckNickname,
    handleSendEmail,
    handleVerifyCode,
    isEmailVerified,
    signup,
    passwordSuccessMessage,
    passwordErrorMessage,
    nicknameErrorMessage,
    nicknameSuccessMessage,
    emailErrorMessage,
    emailSuccessMessage,
  };
}
