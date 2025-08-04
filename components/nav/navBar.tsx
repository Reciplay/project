"use client";

import BaseInput from "@/components/input/baseInput";
import styles from "./navBar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useSidebarStore } from "@/stores/sideBarStore";
import ImageWrapper from "../image/imageWrapper";
import { IMAGETYPE } from "@/types/image";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const { isOpen, toggle } = useSidebarStore();

  const { data: session } = useSession();

  const isLogin: boolean = session?.accessToken != "" || false;

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
        <Link href={isLogin ? ROUTES.PROFILE : ROUTES.AUTH.LOGIN}>
          <Image
            className={styles.profile}
            src={isLogin ? "/images/profile.jpg" : "/icons/profile.svg"}
            alt="profile"
            width={40}
            height={40}
          />
        </Link>
      </div>
    </div>
  );
}
