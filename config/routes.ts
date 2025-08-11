export const ROUTES = {
  HOME: "/",

  SEARCH: {
    ROOT: "/search",
    DETAIL: (query: string) => `/search?query=${query}`
  },

  COURSE: {
    ROOT: "/course",
    DETAIL: (id: string) => `/course/${id}`, // 동적 경로
  },

  PROFILE: {
    ROOT: "/profile",
    SUBSCRIPTIONS: "/profile/subscriptions",
    HISTORY: "/profile/history",
  },

  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    EXTRA: "/api/auth/extra",
  },

  INSTRUCTOR: {
    REGISTER: "/instructor/register",
    DASHBOARD: "/instructor",
    PROFILE: (id: number) => `/instructor/${id}`, // 동적 경로
  },

  ADMIN: "/admin",
} as const;
