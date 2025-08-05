"use client";

import {
  adminSideBarMenus,
  instructorSideBarMenus,
  userSidebarMenus,
} from "@/config/sideBarMenu";
import { useSidebarStore } from "@/stores/sideBarStore";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TablerIcon from "../icon/tablerIcon";
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

  return (
    <Link
      href={href}
      className={classNames(styles.link, { [styles.active]: isActive })}
    >
      {isOpen ? (
        <div className={styles.linkItem}>
          <TablerIcon
            name={icon}
            size={20}
            className={styles.icon}
            filled={isActive}
          />
          <span className={styles.title}>{title}</span>
        </div>
      ) : (
        <TablerIcon
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
  const { data: session } = useSession();

  console.log(session);

  const role = session?.role || "ROLE_STUDENT"; // 기본값은 user

  let sidebarMenu;
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
    </aside>
  );
}
