"use client";

import BaseInput from "@/components/input/baseInput";
import styles from "./navBar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useSidebarStore } from "@/stores/sideBarStore";
import ImageWrapper from "../image/imageWrapper";
import { IMAGETYPE } from "@/types/image";

export default function NavBar() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <ImageWrapper
          src="/icons/hamburger.svg"
          alt="hamberger"
          type={IMAGETYPE.ICON}
          className={styles.hamberger}
          onClick={toggle}
        ></ImageWrapper>

        <Link href={ROUTES.HOME}>
          <div className={styles.logo}>Reciplay</div>
        </Link>
      </div>

      <div className={styles.searchWrapper}>
        <BaseInput type="search" placeholder="검색" />
      </div>
      <div className={styles.right}>
        <Link href="/api/auth/login">
          <Image
            className={styles.profile}
            src="/images/profile.jpg"
            alt="profile"
            width={40}
            height={40}
          />
        </Link>
      </div>
    </div>
  );
}
