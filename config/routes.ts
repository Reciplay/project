export const ROUTES = {
  // 로그인 필요 없음
  HOME: "/",

  // 로그인 필요 없음
  GUIDE: "/guide",

  // 로그인 필요 + ROLE_ADMIN 만 가능
  // ROLE_STUDENT, ROLE_INSTRUCTOR -> HOME 페이지로
  ADMIN: "/admin",

  // 로그인 필요 없음
  COURSE: {
    DETAIL: (id: string) => `/course/${id}`, // 동적 경로
  },

  // 로그인 필요 + ROLE_INSTRUCTOR 만 가능
  // ROLE_STUDENT 일 경우 -> INSTRUCTOR.REGISTER 페이지로
  // ROLE_ADMIN 일 경우 -> ADMIN 페이지로
  INSTRUCTOR: {
    PROFILE: (id: string) => `/instructor/profile/${id}`, // 동적 경로 (얘는 로그인 필요 없고, 강사가 아니어도 됨)
    CREATECOURSE: "/instructor/create-course",
    EDIT: "/instructor/edit",
    MANAGE: "/instructor/manage",
    REGISTER: "/instructor/register", // (얘는 로그인 필요 없고, 학생만)
    DASHBOARD: "/instructor/dashboard",
  },

  // 로그인 필요 + 모든 역할 가능
  // 로그인 상태가 아닐때 -> AUTH.LOGIN 페이지로
  PROFILE: {
    ROOT: "/profile",
    SUBSCRIPTIONS: "/profile/subscriptions",
    HISTORY: "/profile/history",
  },

  // 로그인 필요 없음
  SEARCH: "/search",

  // 로그인 필요 없음

  // 로그인 이후 다른 페이지로 이동할때,
  // EXTRA DATA가 있는 지 확인 후 없다고 판단 시 EXTRA 페이지로
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    EXTRA: "/api/auth/extra",
  },

  // 로그인 필요 + 모든 역할 가능
  // 로그인 상태가 아닐때 -> AUTH.LOGIN 페이지로
  LIVE: (courseId: string, lectureId: string) =>
    `/live/${courseId}/${lectureId}`,
} as const;
