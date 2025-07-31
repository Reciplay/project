"use client";

import { menuData } from "@/config/sideBarMenu";
import { useSidebarStore } from "@/stores/sideBarStore";
import { IMAGETYPE } from "@/types/image";
import classNames from "classnames";
import Link from "next/link";
import ImageWrapper from "../image/imageWrapper";
import IconWithText from "../text/iconWithText";
import styles from "./sideBar.module.scss";

export default function SideBar() {
  const { isOpen } = useSidebarStore();

  const renderLink = (
    href: string,
    icon: string,
    title: string,
    key: number
  ) => (
    <Link href={href} key={key}>
      {isOpen ? (
        <IconWithText iconName={icon} title={title} />
      ) : (
        <ImageWrapper
          src={`/icons/${icon}.svg`}
          alt={title}
          type={IMAGETYPE.ICON}
        />
      )}
    </Link>
  );

  return (
    <aside className={classNames(styles.sidebar, { [styles.closed]: !isOpen })}>
      {menuData.map((item, idx) => {
        if ("section" in item) {
          return (
            <div className={styles.section} key={idx}>
              <div className={styles.sectionTitle}>
                <IconWithText
                  iconName="arrow"
                  title={item.section}
                  left={false}
                />
              </div>
              <div className={styles.sectionList}>
                {item.children.map((child, subIdx) =>
                  renderLink(child.href, child.icon, child.title, subIdx)
                )}
              </div>
            </div>
          );
        }

        return (
          <div className={styles.sectionList} key={idx}>
            {renderLink(item.href, item.icon, item.title, idx)}
          </div>
        );
      })}
    </aside>
  );
}
