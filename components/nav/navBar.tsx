"use client";

// import BaseInput from "@/components/input/baseInput";
// import styles from "./navBar.module.scss";
// import Image from "next/image";
// import Link from "next/link";
// import { ROUTES } from "@/config/routes";
// import { useSidebarStore } from "@/stores/sideBarStore";
// import ImageWrapper from "../image/imageWrapper";
// import { IMAGETYPE } from "@/types/image";
// import { useSession } from "next-auth/react";
// import Logo from "../text/logo";
// import React, { useState } from "react";

// export default function NavBar() {
//   const { isOpen, toggle } = useSidebarStore();

//   const { data: session } = useSession();

//   const isLogin: boolean = session?.accessToken != "" || false;

//   return (
//     <div className={styles.container}>
//       <div className={styles.left}>
//         {/* <ImageWrapper
//           src="/icons/hamburger.svg"
//           alt="hamberger"
//           type={IMAGETYPE.ICON}
//           className={styles.hamberger}
//           onClick={toggle}
//         /> */}
//         <Hamberger />

//         {/* <Link href={ROUTES.HOME}>
//           <Logo></Logo>
//           <div className={styles.logo}>Reciplay</div>
//         </Link> */}
//         <LogoLink />
//       </div>

//       <Search />
//       {/* <div className={styles.searchWrapper}>
//         <BaseInput type="search" placeholder="검색" />
//       </div> */}
//       <div className={styles.right}>
//         <Profile />
//         {/* <Link href={isLogin ? ROUTES.PROFILE : ROUTES.AUTH.LOGIN}>
//           <Image
//             className={styles.profile}
//             src={isLogin ? "/images/profile.jpg" : "/icons/profile.svg"}
//             alt="profile"
//             width={40}
//             height={40}
//           />
//         </Link> */}
//       </div>
//     </div>
//   );

//   function Profile() {
//     return (
//       <Link href={isLogin ? ROUTES.PROFILE : ROUTES.AUTH.LOGIN}>
//         <Image
//           className={styles.profile}
//           src={isLogin ? "/images/profile.jpg" : "/icons/profile.svg"}
//           alt="profile"
//           width={40}
//           height={40}
//         />
//       </Link>
//     );
//   }

//   function Hamberger() {
//     return (
//       <ImageWrapper
//         src="/icons/hamburger.svg"
//         alt="hamberger"
//         type={IMAGETYPE.ICON}
//         className={styles.hamberger}
//         onClick={toggle}
//       />
//     );
//   }

//   function LogoLink() {
//     return (
//       <Link href={ROUTES.HOME}>
//         <Logo></Logo>
//         {/* <div className={styles.logo}>Reciplay</div> */}
//       </Link>
//     );
//   }

//   function Search() {
//     return (
//       <div className={styles.searchWrapper}>
//         <BaseInput type="search" placeholder="검색" />
//       </div>
//     );
//   }
// }

"use client";
import React, { useEffect, useState } from "react";
import BaseInput from "@/components/input/baseInput";
import styles from "./navBar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useSidebarStore } from "@/stores/sideBarStore";
import ImageWrapper from "../image/imageWrapper";
import { IMAGETYPE } from "@/types/image";
import { useSession } from "next-auth/react";
import Logo from "../text/logo";
import TablerIcon from "../icon/tablerIcon";

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
        <Link href={isLogin ? ROUTES.PROFILE : ROUTES.AUTH.LOGIN}>
          <div className={styles.circle}>
            <TablerIcon name="User" size={28} className={styles.profileIcon} />
          </div>
        </Link>
      </div>
    </nav>
  );
}
