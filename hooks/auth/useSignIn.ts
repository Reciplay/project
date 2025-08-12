import { ROUTES } from "@/config/routes";
import { LoginForm } from "@/types/user";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { fetchUserInfo } from "./fetchUserInfo";

export default function useSignIn() {
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

    await fetchUserInfo();

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

  return { login };
}
