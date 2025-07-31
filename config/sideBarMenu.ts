import { MenuSection } from "@/types/sideBar";

export const sidebarMenu: MenuSection[] = [
  {
    section: "강좌",
    children: [
      {
        title: "전체 강좌",
        icon: "Book",
        href: "/",
      },
      {
        title: "카테고리별 강좌",
        icon: "Category",
        href: "/course/category",
      },
      {
        title: "강좌 검색",
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
        title: "구독 강사",
        icon: "Heart",
        href: "/profile/subscriptions",
      },
      {
        title: "수강 이력/찜",
        icon: "History",
        href: "/profile/history",
      },
    ],
  },
  {
    section: "강사 전용",
    children: [
      {
        title: "대시보드",
        icon: "DeviceDesktop", // ✅ 정확한 이름
        href: "/instructor",
      },
      {
        title: "강좌 관리",
        icon: "DeviceDesktopCog",
        href: "/instructor/manage",
      },
      {
        title: "강사 등록",
        icon: "Chalkboard",
        href: "/instructor/register",
      },
      {
        title: "강좌 등록",
        icon: "DeviceIpadHorizontalPlus",
        href: "/instructor/create-course",
      },
    ],
  },
];
