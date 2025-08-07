"use client";

import { ROUTES } from "@/config/routes";
import { fetchUserInfo } from "@/hooks/auth/fetchUserInfo";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const { isExtraFilled, hasHydrated } = useUserStore();

  // ✅ 1. 유저 정보 요청 (조건: 로그인 완료 + Zustand hydrated + 값이 아직 null일 때)
  useEffect(() => {
    if (status === "authenticated" && hasHydrated && isExtraFilled === null) {
      fetchUserInfo(); // 내부에서 setIsExtraFilled 실행
    }
  }, [status, hasHydrated, isExtraFilled]);

  // ✅ 2. 리다이렉션 처리 (조건: 로그인 완료 + hydrated + 값이 false일 때만)
  useEffect(() => {
    if (!hasHydrated || status === "loading" || status === "unauthenticated")
      return;

    if (isExtraFilled === false && pathname !== ROUTES.AUTH.EXTRA) {
      router.replace(ROUTES.AUTH.EXTRA);
    }
  }, [status, isExtraFilled, pathname, hasHydrated, router]);

  return <>{children}</>;
}
