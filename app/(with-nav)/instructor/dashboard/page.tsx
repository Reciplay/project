"use client";

import Calendar from "@/components/calendar/calendar";
import DailySmoothLineChart from "@/components/chart/lineChart";
import { useInstructorStats } from "@/hooks/dashboard/useStats";
import { useSubscriptionTrend } from "@/hooks/dashboard/useSubscriptionTrend"; // Import the new hook
import { useProfile } from "@/hooks/profile/useProfile";
import { useQnaPost } from "@/hooks/qna/useQnaPost";
import Image from "next/image";
import QandAList from "../__components/q&alist/q&aList";
import styles from "./page.module.scss";

export default function Page() {
  const { data, newQuestions, loading, error, profileImageUrl } =
    useInstructorStats();
  const {
    trendData,
    loading: trendLoading,
    error: trendError,
  } = useSubscriptionTrend("daily"); // Fetch subscription trend data

  const { postAnswer } = useQnaPost();

  const handleSubmitAnswer = async ({
    questionId,
    courseId,
    answer,
  }: {
    questionId: number;
    courseId: number;
    answer: string;
  }) => {
    await postAnswer({
      questionId,
      courseId,
      content: answer, // API 스펙에 맞게 content 필드로
    });
  };

  const { userData } = useProfile();

  if (loading || trendLoading) {
    // Check both loadings
    return (
      <div className={styles.messageContainer}>
        강사 통계 정보를 불러오는 중...
      </div>
    );
  }

  if (error || trendError) {
    // Check both errors
    return (
      <div className={`${styles.messageContainer} ${styles.errorMessage}`}>
        오류: {error || trendError}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${styles.messageContainer} ${styles.noDataMessage}`}>
        강사 통계 정보를 찾을 수 없습니다.
      </div>
    );
  }

  if (!userData) {
    return null; // 또는 로딩 스피너
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        {/* 1행: 차트(1) */}
        <div className={`${styles.card} ${styles.chartCard}`}>
          <div className={styles.cardHeader}>
            <span>📈</span>
            <h3 className={styles.cardTitle}>구독자 추이</h3>
          </div>
          <div className={styles.chartArea}>
            <DailySmoothLineChart data={trendData} />{" "}
            {/* Pass trendData to the chart */}
          </div>
        </div>

        {/* 1행: 프로필(1) */}
        <div className={`${styles.card} ${styles.profileCard}`}>
          <div className={styles.profileInfo}>
            <div>
              <div className={styles.profileName}>{userData.name}</div>
              <div className={styles.profileSub}>{userData.job}</div>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metricRow}>
                <span>총 수강생 수</span>
                <strong>{data?.totalStudents ?? 0}</strong>
              </div>
              <div className={styles.metricRow}>
                <span>평균 별점</span>
                <strong>{data?.averageStars ?? 0}</strong>
              </div>
              <div className={styles.metricRow}>
                <span>총 리뷰 수</span>
                <strong>{data?.totalReviewCount ?? 0}</strong>
              </div>
              <div className={styles.metricRow}>
                <span>구독자 수</span>
                <strong>{data?.subscriberCount ?? 0}</strong>
              </div>
            </div>
          </div>

          <div className={styles.wrapper}>
            {profileImageUrl && (
              <Image
                className={styles.image}
                src={profileImageUrl}
                alt="profile"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </div>

        {/* 2행: 달력(2) */}
        <div className={`${styles.card} ${styles.calendarCard}`}>
          {/* <CalendarOnly /> */}
          <Calendar lectures={[]} />
        </div>
        <div className={`${styles.card} ${styles.qaCard}`}>
          <QandAList
            questions={newQuestions ?? []}
            onSubmitAnswer={handleSubmitAnswer}
          />
        </div>
      </div>
    </div>
  );
}
