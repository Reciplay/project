import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { ROUTES } from "@/config/routes";
import restClient from "@/lib/axios/restClient";
import { LoginForm, SignupForm, UserExtra } from "@/types/user";

export default function useAuth() {
  const router = useRouter();

  const login = async (data: LoginForm) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!result?.ok) {
      alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.");
      return;
    }

    const session = await getSession();
    if (!session) return;

    // if (session.required) {
    //   router.push(ROUTES.AUTH.EXTRA);
    //   return;
    // }

    switch (session.role) {
      case "student":
        router.push(ROUTES.HOME);
        break;
      case "instructor":
        router.push(ROUTES.INSTRUCTOR.DASHBOARD);
        break;
      case "admin":
        router.push(ROUTES.ADMIN);
        break;
      default:
        router.push(ROUTES.HOME);
    }
  };

  const signup = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      alert("비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await restClient.post("/user/auth/signup", {
        nickname: data.nickname,
        email: data.email,
        password: data.password,
      });

      if (res.status === 201) {
        alert("회원가입 성공!");
        router.push(ROUTES.AUTH.LOGIN);
      } else {
        alert("회원가입 실패");
      }
    } catch (error) {
      alert("서버 오류 발생");
    }
  };

  const submitExtra = async (data: UserExtra) => {
    try {
      const res = await restClient.post("/api/v1/user/profile", data);

      if (res.status === 200) {
        alert("추가 정보가 저장되었습니다!");
        await signIn("credentials", { redirect: true }); // 세션 갱신
        router.push(ROUTES.HOME);
      } else {
        alert("추가 정보 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("추가 정보 제출 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return { login, signup, submitExtra };
}
