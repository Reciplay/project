import Link from "next/link";
import IconWithText from "../text/iconWithText";
import styles from "./sideBar.module.scss";
import { ROUTES } from "@/config/routes";

export default function SideBar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sectionList}>
        <IconWithText iconName="live" title="전체 라이브" />
        <IconWithText iconName="category" title="카테고리" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Link href={ROUTES.PROFILE}>
            <IconWithText iconName="arrow" title="내 프로필" left={false} />
          </Link>
        </div>
        <div className={styles.sectionList}>
          <Link href={ROUTES.SUBSCRIBE}>
            <IconWithText iconName="subscribe" title="구독" />
          </Link>

          {/* <Link href={ROUTES.SUBSCRIBE}></Link> */}
          <IconWithText iconName="record" title="기록" />

          {/* <Link href={ROUTES.SUBSCRIBE}></Link> */}
          <IconWithText iconName="security" title="보안" />

          {/* <Link href={ROUTES.SUBSCRIBE}></Link> */}
          <IconWithText iconName="setting" title="설정" />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {/* <Link href={ROUTES.SUBSCRIBE}></Link> */}
          <IconWithText iconName="arrow" title="스튜디오" left={false} />
        </div>
        <div className={styles.sectionList}>
          <IconWithText iconName="list" title="강사 전용" />
          <IconWithText iconName="list" title="강좌 관리" />
          <IconWithText iconName="list" title="강좌 생성" />
        </div>
      </div>
    </aside>
  );
}
