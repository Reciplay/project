// components/gate/redirectGate.tsx
"use client";

import { ROUTES } from "@/config/routes";
import { fetchUserInfo } from "@/hooks/auth/fetchUserInfo";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

/** 세션에서 role 읽기 (session.user.role 또는 session.role 둘 다 대응) */
function useRole() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session as any)?.user?.role ?? (session as any)?.role ?? null;
  return role as "ROLE_ADMIN" | "ROLE_INSTRUCTOR" | "ROLE_STUDENT" | null;
}

/** 경로 매칭 유틸 & 플래그 생성 */
function useGuards() {
  const pathname = usePathname();

  const isPrefixOf = (prefix: string) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`);

  // 로그인 필요 영역
  const PROFILE_ROUTES = useMemo(
    () =>
      new Set<string>([
        ROUTES.PROFILE.ROOT,
        ROUTES.PROFILE.SUBSCRIPTIONS,
        ROUTES.PROFILE.HISTORY,
      ]),
    []
  );

  const INSTRUCTOR_PROTECTED_ROUTES = useMemo(
    () =>
      new Set<string>([
        ROUTES.INSTRUCTOR.DASHBOARD,
        ROUTES.INSTRUCTOR.CREATECOURSE,
        ROUTES.INSTRUCTOR.EDIT,
        ROUTES.INSTRUCTOR.MANAGE,
      ]),
    []
  );

  const MATCH = useMemo(() => {
    const isInstructorRoot = pathname === "/instructor";

    // ✅ 공개 강사 프로필: /instructor/profile/:id
    const isPublicInstructorProfile =
      pathname.startsWith("/instructor/profile/") &&
      !INSTRUCTOR_PROTECTED_ROUTES.has(pathname) &&
      pathname !== ROUTES.INSTRUCTOR.REGISTER;

    return {
      // 관리자
      isAdminRoot: pathname === ROUTES.ADMIN,

      // 공통 보호
      isProfile: PROFILE_ROUTES.has(pathname),
      isLive: isPrefixOf("/live"),

      // 강사 영역
      isInstructorRoot, // /instructor 루트
      isInstructorRegister: pathname === ROUTES.INSTRUCTOR.REGISTER,
      isInstructorDashboard:
        pathname === ROUTES.INSTRUCTOR.DASHBOARD ||
        isPrefixOf(ROUTES.INSTRUCTOR.DASHBOARD),
      isInstructorCreate: pathname === ROUTES.INSTRUCTOR.CREATECOURSE,
      isInstructorEdit: pathname === ROUTES.INSTRUCTOR.EDIT,
      isInstructorManage: pathname === ROUTES.INSTRUCTOR.MANAGE,

      // 공개 페이지
      isHome: pathname === ROUTES.HOME,
      isGuide: pathname === ROUTES.GUIDE,
      isSearch: pathname === ROUTES.SEARCH.ROOT,
      isAuthExtra: pathname === ROUTES.AUTH.EXTRA,
      isAuthLogin: pathname === ROUTES.AUTH.LOGIN,
      isAuthSignup: pathname === ROUTES.AUTH.SIGNUP,
      isPublicInstructorProfile,
      isCourseDetail: pathname.startsWith("/course/"),
    };
  }, [pathname, PROFILE_ROUTES, INSTRUCTOR_PROTECTED_ROUTES]);

  return { MATCH, pathname };
}

export default function RedirectGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { isExtraFilled, hasHydrated } = useUserStore();
  const role = useRole();
  const { MATCH } = useGuards();

  const safeReplace = (to: string) => {
    if (to && to !== pathname) router.replace(to);
  };

  const isLoading = status === "loading" || !hasHydrated;

  // 공개 라우트
  const isPublicRoute =
    MATCH.isHome ||
    MATCH.isGuide ||
    MATCH.isSearch ||
    MATCH.isCourseDetail ||
    MATCH.isPublicInstructorProfile ||
    MATCH.isInstructorRegister ||
    MATCH.isAuthLogin ||
    MATCH.isAuthSignup ||
    MATCH.isAuthExtra;

  // 보호 라우트
  const requiresLoginCommon = MATCH.isProfile || MATCH.isLive;
  const requiresInstructor =
    MATCH.isInstructorDashboard ||
    MATCH.isInstructorCreate ||
    MATCH.isInstructorEdit ||
    MATCH.isInstructorManage;
  const requiresAdmin = MATCH.isAdminRoot;

  /** B) 로그인 직후 추가정보 로딩 */
  useEffect(() => {
    if (!hasHydrated) return;
    if (status === "unauthenticated" && !isPublicRoute) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [status, pathname, hasHydrated, router]);
  // 1) 사용자 추가정보 로딩
  useEffect(() => {
    if (status === "authenticated" && hasHydrated && isExtraFilled === null) {
      fetchUserInfo();
    }
  }, [isLoading, status, isExtraFilled]);

  /** C) 추가정보(EXTRA) 강제 분기 */
  useEffect(() => {
    if (isLoading) return;

    if (
      status === "authenticated" &&
      isExtraFilled === false &&
      !MATCH.isAuthExtra
    ) {
      safeReplace(ROUTES.AUTH.EXTRA);
      return;
    }

    if (
      MATCH.isAuthExtra &&
      status === "authenticated" &&
      isExtraFilled === true
    ) {
      safeReplace(ROUTES.HOME);
      return;
    }
  }, [isLoading, status, isExtraFilled, MATCH.isAuthExtra]);

  /** D) 공통 보호 라우트 */
  useEffect(() => {
    if (isLoading) return;

    if (requiresLoginCommon && status === "unauthenticated") {
      safeReplace(ROUTES.AUTH.LOGIN);
      return;
    }
  }, [isLoading, requiresLoginCommon, status]);

  /** E) 관리자 라우트 */
  useEffect(() => {
    if (isLoading || !requiresAdmin) return;

    if (status === "unauthenticated") {
      safeReplace(ROUTES.AUTH.LOGIN);
      return;
    }
    if (status === "authenticated" && role !== "ROLE_ADMIN") {
      safeReplace(ROUTES.HOME);
      return;
    }
  }, [isLoading, requiresAdmin, status, role]);

  /** F) 강사 라우트 */
  useEffect(() => {
    if (isLoading || !requiresInstructor) return;

    if (status === "unauthenticated") {
      safeReplace(ROUTES.AUTH.LOGIN);
      return;
    }
    if (status === "authenticated") {
      if (role === "ROLE_ADMIN") {
        safeReplace(ROUTES.ADMIN);
        return;
      }
      if (role === "ROLE_STUDENT") {
        safeReplace(ROUTES.INSTRUCTOR.REGISTER);
        return;
      }
    }
  }, [isLoading, requiresInstructor, status, role]);

  /** F-1) /instructor 루트 접근 규칙 */
  useEffect(() => {
    if (isLoading || !MATCH.isInstructorRoot) return;

    if (status === "unauthenticated") {
      safeReplace(ROUTES.INSTRUCTOR.REGISTER);
      return;
    }

    if (role === "ROLE_ADMIN") {
      safeReplace(ROUTES.ADMIN);
      return;
    }
    if (role === "ROLE_INSTRUCTOR") {
      safeReplace(ROUTES.INSTRUCTOR.DASHBOARD);
      return;
    }
    safeReplace(ROUTES.INSTRUCTOR.REGISTER);
  }, [isLoading, MATCH.isInstructorRoot, status, role]);

  /** I) 최후 수단 가드 */
  useEffect(() => {
    if (isLoading) return;

    if (!isPublicRoute && status === "unauthenticated") {
      safeReplace(ROUTES.AUTH.LOGIN);
      return;
    }
  }, [isLoading, isPublicRoute, status]);

  if (isLoading) return null;
  return <>{children}</>;
}
