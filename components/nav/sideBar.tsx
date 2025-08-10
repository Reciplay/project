"use client";

import {
  adminSideBarMenus,
  instructorSideBarMenus,
  userSidebarMenus,
} from "@/config/sideBarMenu";
import { useLogout } from "@/hooks/auth/useLogout";
import { useWindowWidth } from "@/hooks/useWindowSize";
import { useSidebarStore } from "@/stores/sideBarStore";
import { MenuSection } from "@/types/sideBar";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BaseButton from "../button/baseButton";
import CustomIcon from "../icon/customIcon";
import styles from "./sideBar.module.scss";
interface LinkItemProps {
  href: string;
  icon: string;
  title: string;
  isOpen: boolean;
  isButton?: boolean;
}

function LinkItem({
  href,
  icon,
  title,
  isOpen,
  isButton = false,
}: LinkItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // 컴포넌트 내부

  return (
    <Link
      href={href}
      className={classNames(styles.link, { [styles.active]: isActive })}
    >
      {isOpen ? (
        <div className={styles.linkItem}>
          <CustomIcon
            name={icon}
            size={20}
            className={styles.icon}
            filled={isActive}
          />

          <span className={styles.title}>{title}</span>
        </div>
      ) : (
        <CustomIcon
          name={icon}
          size={20}
          className={styles.iconOnly}
          filled={isActive}
        />
      )}
    </Link>
  );
}

export default function SideBar() {
  const { isOpen } = useSidebarStore();
  const { data: session, status } = useSession();
  const { logout } = useLogout();
  const width = useWindowWidth();

  console.log(session);

  const role = session?.role || "ROLE_STUDENT";

  let sidebarMenu: MenuSection[];
  if (role === "ROLE_ADMIN") {
    sidebarMenu = adminSideBarMenus;
  } else if (role === "ROLE_INSTRUCTOR") {
    sidebarMenu = instructorSideBarMenus;
  } else {
    sidebarMenu = userSidebarMenus;
  }

  return (
    <aside className={classNames(styles.sidebar, { [styles.closed]: !isOpen })}>
      {sidebarMenu.map((section, idx) => (
        <div className={styles.section} key={idx}>
          {isOpen && (
            <div className={styles.sectionTitle}>
              <span>{section.section}</span>
            </div>
          )}
          <div className={styles.sectionList}>
            {section.children.map((item, subIdx) => (
              <LinkItem
                key={subIdx}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isOpen={isOpen}
              />
            ))}
          </div>
        </div>
      ))}

      {status === "authenticated" && (
        <div>
          {width > 1400 ? (
            <BaseButton title="로그아웃" onClick={logout} />
          ) : (
            <div className={styles.section} onClick={logout}>
              <CustomIcon name="Logout" className={styles.iconOnly} size={20} />
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
