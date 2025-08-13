"use client";

import { ROUTES } from "@/config/routes";
import { useSidebarStore } from "@/stores/sideBarStore";
import { IMAGETYPE } from "@/types/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomButton from "../button/customButton";
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

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(ROUTES.SEARCH.DETAIL(encodeURIComponent(query)));
    if (isMobile) setShowSearch(false);
  };

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

      {/* 오른쪽 */}
      <div className={styles.right}>
        <Link href={ROUTES.SEARCH.ROOT}>
          <TablerIcon name="Search" size={28} />
        </Link>
        {isLogin ? (
          <>
            <Link href={ROUTES.PROFILE.ROOT}>
              <div className={styles.circle}>
                <TablerIcon
                  name="User"
                  size={28}
                  className={styles.profileIcon}
                />
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link href={ROUTES.AUTH.LOGIN}>
              <CustomButton title="로그인" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
