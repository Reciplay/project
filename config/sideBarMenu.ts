import { MenuSection } from "@/types/sideBar";

export const userSidebarMenus: MenuSection[] = [
  {
    section: "강좌",
    children: [
      {
        title: "전체 강좌",
        icon: "Book",
        href: "/",
      },
      {
        title: "검색하기",
        icon: "Search",
        href: "/search",
      },
    ],
  },
  {
    section: "마이페이지",
    children: [
      {
        title: "내 정보",
        icon: "User",
        href: "/profile",
      },
      {
        title: "구독",
        icon: "Heart",
        href: "/profile/subscriptions",
      },
      {
        title: "강사 등록",
        icon: "Mood-Edit",
        href: "/instructor/register",
      },
    ],
  },
];

export const instructorSideBarMenus: MenuSection[] = [
  {
    section: "강좌",
    children: [
      {
        title: "전체 강좌",
        icon: "Book",
        href: "/",
      },
      {
        title: "검색하기",
        icon: "Search",
        href: "/search",
      },
    ],
  },
  {
    section: "마이페이지",
    children: [
      {
        title: "내 정보",
        icon: "User",
        href: "/profile",
      },
      {
        title: "구독",
        icon: "Heart",
        href: "/profile/subscriptions",
      },
    ],
  },
  {
    section: "스튜디오",
    children: [
      {
        title: "대시보드",
        icon: "Device-Desktop-Analytics",
        href: "/instructor/dashboard",
      },
      {
        title: "강좌 관리",
        icon: "Device-Desktop-Cog",
        href: "/instructor/manage",
      },

      {
        title: "강좌 등록",
        icon: "Device-Ipad-Horizontal-Plus",
        href: "/instructor/create-course",
      },
      {
        title: "정보 수정",
        icon: "User-Edit",
        href: "/instructor/edit",
      },
    ],
  },
];

export const adminSideBarMenus: MenuSection[] = [
  {
    section: "강좌",
    children: [
      {
        title: "전체 강좌",
        icon: "Book",
        href: "/",
      },
      {
        title: "검색하기",
        icon: "Search",
        href: "/search",
      },
    ],
  },
  {
    section: "마이페이지",
    children: [
      {
        title: "내 정보",
        icon: "User",
        href: "/profile",
      },
      {
        title: "구독",
        icon: "Heart",
        href: "/profile/subscriptions",
      },
    ],
  },
  {
    section: "관리",
    children: [
      {
        title: "대시보드",
        icon: "Device-Desktop-Analytics",
        href: "/admin",
      },
    ],
  },
];
