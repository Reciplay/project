import { useProfile } from "@/hooks/profile/useProfile";
import { InstructorStats } from "@/types/instructorStats";
import Image from "next/image";
import styles from "../page.module.scss";

interface DashboardProfileProps {
  statData: InstructorStats | null;
  loading: boolean;
  error: string;
}

export default function DashboardProfile({
  statData,
  loading,
  error,
}: DashboardProfileProps) {
  const { data: userData } = useProfile();

  if (!statData) {
    return (
      <div className={`${styles.messageContainer} ${styles.noDataMessage}`}>
        강사 통계 정보를 찾을 수 없습니다.
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  if (loading) {
    // Check both loadings
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
    <div className={`${styles.card} ${styles.profileCard}`}>
      <div className={styles.profileInfo}>
        <div>
          <div className={styles.profileName}>{userData.name}</div>
          <div className={styles.profileSub}>{userData.job}</div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metricRow}>
            <span>총 수강생 수</span>
            <strong>{statData?.totalStudents ?? 0}</strong>
          </div>
          <div className={styles.metricRow}>
            <span>평균 별점</span>
            <strong>{statData?.averageStars ?? 0}</strong>
          </div>
          <div className={styles.metricRow}>
            <span>총 리뷰 수</span>
            <strong>{statData?.totalReviewCount ?? 0}</strong>
          </div>
          <div className={styles.metricRow}>
            <span>구독자 수</span>
            <strong>{statData?.subscriberCount ?? 0}</strong>
          </div>
        </div>
      </div>

      <div className={styles.wrapper}>
        {statData?.profileFileInfo?.presignedUrl && (
          <Image
            className={styles.image}
            src={statData?.profileFileInfo?.presignedUrl}
            alt="profile"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>
    </div>
  );
}
