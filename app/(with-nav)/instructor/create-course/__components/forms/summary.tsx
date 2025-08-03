import BaseButton from "@/components/button/baseButton";
import styles from "./summary.module.scss";

export default function Summary() {
  return (
    <div className={styles.summary}>
      <span className={styles.middle}>
        직접 작성해도 되지만 Ai로 요약하기를 사용해보세요!
      </span>
      <BaseButton title="생성하기" variant="custom"></BaseButton>
    </div>
  );
}
