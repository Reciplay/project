"use client";

"use client";
import BaseInput from "@/components/input/baseInput";
import { ROUTES } from "@/config/routes";
import { useSidebarStore } from "@/stores/sideBarStore";
import { IMAGETYPE } from "@/types/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TablerIcon from "../icon/tablerIcon";
import ImageWrapper from "../image/imageWrapper";
import Logo from "../text/logo";
import styles from "./navBar.module.scss";

export default function NavBar() {
  const { toggle } = useSidebarStore();
  const { data: session } = useSession();
  const isLogin = !!session?.accessToken;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className={styles.navbar}>
      {/* 왼쪽 */}
      <div className={styles.left}>
        <ImageWrapper
          src="/icons/hamburger.svg"
          alt="hamburger"
          type={IMAGETYPE.ICON}
          className={styles.hamburger}
          onClick={toggle}
        />
        <Link href={ROUTES.HOME} className={styles.logoLink}>
          <Logo />
        </Link>
      </div>

      {/* 가운데 */}
      {!isMobile && (
        <div className={styles.center}>
          <BaseInput type="search" placeholder="검색" />
        </div>
      )}

      {/* 오른쪽 */}
      <div className={styles.right}>
        {isMobile && (
          <>
            {!showSearch ? (
              <button
                className={styles.iconButton}
                aria-label="검색"
                onClick={() => setShowSearch(true)}
                type="button"
              >
                <TablerIcon name="Search" size={28} />
              </button>
            ) : (
              <BaseInput
                type="search"
                placeholder="검색"
                autoFocus
                className={styles.mobileSearchInput}
                onBlur={() => setShowSearch(false)}
              />
            )}
          </>
        )}
        <Link href={isLogin ? ROUTES.PROFILE.ROOT : ROUTES.AUTH.LOGIN}>
          <div className={styles.circle}>
            <TablerIcon name="User" size={28} className={styles.profileIcon} />
          </div>
        </Link>
      </div>
    </nav>
  );
}
