import Link from "next/link";
import IconWithText from "../text/iconWithText";
import styles from "./sideBar.module.scss";

export default function SideBar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <IconWithText iconName="live" title="전체 라이브" />
        <IconWithText iconName="category" title="카테고리" />
      </div>

      <div className={styles.section}>
        <IconWithText iconName="live" title="내 프로필" />
        <IconWithText iconName="subscribe" title="구독" />
        <IconWithText iconName="record" title="기록" />
        <IconWithText iconName="security" title="보안" />
        <IconWithText iconName="setting" title="설정" />
      </div>

      <div className={styles.section}>
        <IconWithText iconName="list" title="강사 전용" />
        <IconWithText iconName="list" title="강좌 관리" />
        <IconWithText iconName="list" title="강좌 생성" />
      </div>
    </aside>
  );
}
