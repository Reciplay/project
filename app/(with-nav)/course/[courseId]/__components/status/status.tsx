import ProgressPieChart from "@/components/chart/progressPieChart";
import styles from "./status.module.scss";

interface StatusProps {
  level: number;
}

export default function Status({ level }: StatusProps) {
  return (
    <div className={styles.status}>
      <div className={styles.left}>
        <div className={styles.title}>나의 학습 현황</div>
        <div className={styles.content}>
          <div className={styles.center}>
            <ProgressPieChart pathColor="#14ae5c" value={level} />
            <div>오늘의 학습량</div>
          </div>
          <div className={styles.center}>
            <ProgressPieChart pathColor="#007aff" value={level} />
            <div>총 학습량</div>
          </div>
        </div>
      </div>
    </div>
  );
}
