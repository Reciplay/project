import SmoothLineChart from "@/components/chart/lineChart";
import {
  useSubscriptionTrend,
  type SubscriptionCriteria,
} from "@/hooks/dashboard/useSubscriptionTrend";
import { Segmented } from "antd";
import { useState } from "react";
import styles from "../page.module.scss";

export default function DashboardChart() {
  const [period, setPeriod] = useState<SubscriptionCriteria>("day");
  const { trendData, loading, error } = useSubscriptionTrend(period);

  if (loading) {
    return (
      <div className={styles.messageContainer}>
        강사 통계 정보를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.messageContainer} ${styles.errorMessage}`}>
        오류: {error}
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles.chartCard}`}>
      <div className={styles.cardHeader}>
        <span>📈</span>
        <h3 className={styles.cardTitle}>구독자 추이</h3>
        <Segmented
          options={[
            { label: "일간", value: "day" },
            { label: "주간", value: "week" },
            { label: "월간", value: "month" },
          ]}
          value={period}
          onChange={(value) => setPeriod(value as SubscriptionCriteria)}
        />
      </div>
      <div className={styles.chartArea}>
        <SmoothLineChart
          data={trendData!}
          timeUnit={
            period === "day" ? "day" : period === "week" ? "week" : "month"
          }
        />
      </div>
    </div>
  );
}
