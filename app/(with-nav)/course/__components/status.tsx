import ProgressPieChart from "@/components/chart/progressPieChart";
import styles from "./status.module.scss";

export default function Status() {
  return (
    <div className={styles.status}>
      <div className={styles.left}>
        <div className={styles.title}>나의 학습 현황</div>
        <div className={styles.content}>
          <div className={styles.center}>
            <ProgressPieChart pathColor="#14ae5c" />
            <div>오늘의 학습량</div>
          </div>
          <div className={styles.center}>
            <ProgressPieChart pathColor="#007aff" />
            <div>총 학습량</div>
          </div>
        </div>
      </div>
    </div>
  );
}
