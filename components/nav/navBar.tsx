import BaseInput from "@/components/input/baseInput";
import styles from "./navBar.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image
          src="/icons/hamburger.svg"
          alt="hamberger"
          width={24}
          height={24}
        />
        <div className={styles.logo}>Reciplay</div>
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
