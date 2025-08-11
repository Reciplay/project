"use client";

import { ROUTES } from "@/config/routes";
import { fetchUserInfo } from "@/hooks/auth/fetchUserInfo";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function RedirectGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession(); // session은 status만 사용
  const { isExtraFilled, hasHydrated } = useUserStore();

  // ✅ 로그인 필수 "정확 일치" 라우트
  const PROTECTED_ROUTES: string[] = useMemo(
    () => [
      ROUTES.PROFILE.ROOT,
      ROUTES.PROFILE.SUBSCRIPTIONS,
      ROUTES.INSTRUCTOR.REGISTER,
    ],
    []
  );

  // // ✅ 로그인 필수 "프리픽스 매칭" 라우트 (동적 경로용)
  // const PROTECTED_PREFIXES: string[] = useMemo(
  //   () => [
  //     ROUTES.COURSE.ROOT, // /course, /course/123 ...
  //     ROUTES.INSTRUCTOR.DASHBOARD, // /instructor, /instructor/...
  //   ],
  //   []
  // );

  const isProtected = (p: string) => PROTECTED_ROUTES.includes(p);
  // ||
  //   PROTECTED_PREFIXES.some(
  //     (prefix) => p === prefix || p.startsWith(`${prefix}/`)
  //   );

  // 0) 로그인 안 되어 있고 보호 라우트면 → 로그인으로
  useEffect(() => {
    if (!hasHydrated) return;
    if (status === "unauthenticated" && isProtected(pathname)) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [status, pathname, hasHydrated, router]);
  // 1) 사용자 추가정보 로딩
  useEffect(() => {
    if (status === "authenticated" && hasHydrated && isExtraFilled === null) {
      fetchUserInfo();
    }
  }, [status, hasHydrated, isExtraFilled]);

  // 2) 추가정보 미입력시 → 추가정보 페이지로
  useEffect(() => {
    if (!hasHydrated || status !== "authenticated") return;
    if (isExtraFilled === false && pathname !== ROUTES.AUTH.EXTRA) {
      router.replace(ROUTES.AUTH.EXTRA);
    }
  }, [status, isExtraFilled, pathname, hasHydrated, router]);

  return <>{children}</>;
}
