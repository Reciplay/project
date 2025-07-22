import styles from "./sideBar.module.scss";

export default function SideBar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <div className={styles.item}>전체 라이브</div>
        <div className={styles.item}>카테고리</div>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>내 프로필</div>
        <div className={styles.item}>구독</div>
        <div className={styles.item}>기록</div>
        <div className={styles.item}>보안</div>
        <div className={styles.item}>설정</div>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>강사 전용</div>
        <div className={styles.item}>강좌 관리</div>
        <div className={styles.item}>강좌 생성</div>
      </div>
    </aside>
  );
}
