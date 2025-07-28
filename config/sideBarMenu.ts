import { MenuItem, MenuSection } from "@/types/sideBar";

export const menuData: (MenuItem | MenuSection)[] = [
  {
    section: "라이브",
    children: [
      {
        title: "전체 라이브",
        icon: "live",
        href: "/live",
      },
      {
        title: "카테고리",
        icon: "category",
        href: "/courses",
      },
    ],
  },

  {
    section: "프로필",
    children: [
      { title: "구독", icon: "subscribe", href: "/profile/subscription" },
      { title: "기록", icon: "record", href: "/profile/learning" },
      { title: "보안", icon: "security", href: "/profile/security" },
      {
        title: "설정",
        icon: "setting",
        href: "/settings",
      },
    ],
  },
  {
    section: "스튜디오 관리",
    children: [
      { title: "강사 목록", icon: "list", href: "/instructors" },
      { title: "강좌 목록", icon: "list", href: "/studio/my-courses" },
      { title: "강좌 등록", icon: "plus", href: "/studio/create" },
      { title: "대시보드", icon: "user", href: "/studio/dashboard" },
    ],
  },
] as const;
