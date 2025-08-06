"use client";

import { useUserStore } from "@/stores/userStore";
import { signOut } from "next-auth/react";

export const useLogout = () => {
  const logout = async () => {
    // 1. NextAuth 세션 로그아웃 먼저
    await signOut({ redirect: false });

    // 2. Zustand 상태 초기화
    useUserStore.getState().setIsExtraFilled(null);

    // 3. localStorage에서 persist된 값 제거
    localStorage.removeItem("user-extra");

    // 4. 수동 리다이렉트
    window.location.href = "/";
  };

  return { logout };
};
