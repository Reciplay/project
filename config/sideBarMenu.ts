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
        title: "카테고리",
        icon: "Category",
        href: "/course/category",
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
        title: "이력/찜",
        icon: "History",
        href: "/profile/history",
      },
      {
        title: "강사 등록",
        icon: "Chalkboard",
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
        title: "카테고리",
        icon: "Category",
        href: "/course/category",
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
        title: "이력/찜",
        icon: "History",
        href: "/profile/history",
      },
    ],
  },
  {
    section: "스튜디오",
    children: [
      {
        title: "대시보드",
        icon: "DeviceDesktop",
        href: "/instructor",
      },
      {
        title: "강좌 관리",
        icon: "DeviceDesktopCog",
        href: "/instructor/manage",
      },

      {
        title: "강좌 등록",
        icon: "DeviceIpadHorizontalPlus",
        href: "/instructor/create-course",
      },
      {
        title: "정보 수정",
        icon: "DeviceDesktop",
        href: "/instructor",
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
        title: "카테고리",
        icon: "Category",
        href: "/course/category",
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
        title: "이력/찜",
        icon: "History",
        href: "/profile/history",
      },
    ],
  },
  {
    section: "관리",
    children: [
      {
        title: "대시보드",
        icon: "DeviceDesktop",
        href: "/admin",
      },
    ],
  },
];
