"use client";

import { ROUTES } from "@/config/routes";
import { fetchUserInfo } from "@/hooks/auth/fetchUserInfo";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

function useRole() {
  const { data: session } = useSession();
  const role = session?.role ?? null;
  return role as "ROLE_ADMIN" | "ROLE_INSTRUCTOR" | "ROLE_STUDENT" | null;
}

/** 경로 매칭 유틸 & 플래그 생성 */
function useGuards() {
  const pathname = usePathname();

  const isPrefixOf = useCallback(
    (prefix: string) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
    [pathname],
  );

  // 로그인 필요 영역
  const PROFILE_ROUTES = useMemo(
    () =>
      new Set<string>([
        ROUTES.PROFILE.ROOT,
        ROUTES.PROFILE.SUBSCRIPTIONS,
        ROUTES.PROFILE.HISTORY,
        ROUTES.INSTRUCTOR.REGISTER,
      ]),
    [],
  );

  const MATCH = useMemo(() => {
    const isInstructorRoot = pathname === "/instructor";
    const isPublicInstructorProfile = pathname.startsWith(
      "/instructor/profile/",
    );

    return {
      // 관리자
      isAdminRoot: pathname === ROUTES.ADMIN,

      // 공통 보호
      isProfile: PROFILE_ROUTES.has(pathname),
      isLive: isPrefixOf("/live"),

      // 강사 영역
      isInstructorRoot,
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
  }, [pathname, PROFILE_ROUTES, isPrefixOf]); // ✅ INSTRUCTOR_PROTECTED_ROUTES 제거

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

  // ✅ 안정화
  const safeReplace = useCallback(
    (to: string) => {
      if (to && to !== pathname) router.replace(to);
    },
    [pathname, router],
  );

  const isLoading = status === "loading" || !hasHydrated;

  // 공개 라우트
  const isPublicRoute =
    MATCH.isHome ||
    MATCH.isGuide ||
    MATCH.isSearch ||
    MATCH.isPublicInstructorProfile ||
    MATCH.isInstructorRegister ||
    MATCH.isAuthLogin ||
    MATCH.isAuthSignup ||
    MATCH.isAuthExtra;

  // 보호 라우트
  const requiresLoginCommon =
    MATCH.isProfile || MATCH.isLive || MATCH.isCourseDetail;
  const requiresInstructor =
    MATCH.isInstructorDashboard ||
    MATCH.isInstructorCreate ||
    MATCH.isInstructorEdit ||
    MATCH.isInstructorManage;
  const requiresAdmin = MATCH.isAdminRoot;

  /**
   * B) 비인증 사용자 보호 라우트 가드
   * 비인증 사용자가 공개 라우트가 아닌 곳에 접근 시 로그인 페이지로 리디렉션합니다.
   */
  useEffect(() => {
    // isLoading 상태가 아닐 때만 실행 (세션 및 스토어 로딩 완료 후)
    if (isLoading) return;

    // 비인증 상태이고 현재 라우트가 공개 라우트가 아니라면 로그인 페이지로 리디렉션
    if (status === "unauthenticated" && !isPublicRoute) {
      safeReplace(ROUTES.AUTH.LOGIN);
      return;
    }
  }, [isLoading, status, isPublicRoute, safeReplace]);

  // 1) 사용자 추가정보 로딩
  useEffect(() => {
    if (status === "authenticated" && hasHydrated && isExtraFilled === null) {
      fetchUserInfo();
    }
  }, [status, hasHydrated, isExtraFilled]);

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
  }, [isLoading, status, isExtraFilled, MATCH.isAuthExtra, safeReplace]);

  /** D) 공통 보호 라우트 */
  useEffect(() => {
    if (isLoading) return;

    if (requiresLoginCommon && status === "unauthenticated") {
      safeReplace(ROUTES.AUTH.LOGIN);
      return;
    }
  }, [isLoading, requiresLoginCommon, status, safeReplace]);

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
  }, [isLoading, requiresAdmin, status, role, safeReplace]);

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
  }, [isLoading, requiresInstructor, status, role, safeReplace]);

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
  }, [isLoading, MATCH.isInstructorRoot, status, role, safeReplace]);

  if (isLoading) return null;
  return <>{children}</>;
}
