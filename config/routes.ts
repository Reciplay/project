export const ROUTES = {
  HOME: "/",

  COURSE: "/course",
  PROFILE: "/profile",
  SUBSCRIBE: "/subscribe",
  // INSTRUCTOR: "/instructor",
  SEARCH: "/search",

  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    EXTRA: "/api/auth/extra",
  },

  INSTRUCTOR: {
    DASHBOARD: "/instructor",
  },
  ADMIN: "/admin",

  // 동적 경로 (필요 시)
  COURSE_DETAIL: (id: string) => `/course/${id}`,
  INSTRUCTOR_PROFILE: (id: number) => `/instructor/${id}`,
};
