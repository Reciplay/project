"use client";

import CalendarOnly from "@/components/calendar/calendarOnly";
import DailySmoothLineChart from "@/components/chart/lineChart";
import TableComponent from "@/components/table/table";
import Image from "next/image";
import styles from "./page.module.scss";
import Calendar from "@/components/calendar/calendar";
import QandAList from "./__components/q&alist/q&aList";
import { useInstructorStats } from "@/hooks/dashboard/useStats";
import { useProfile } from "@/hooks/profile/useProfile";

export default function Page() {
  const {
    data,
    loading,
    error,
    refresh,
    totalStudents,
    averageStars,
    totalReviewCount,
    subscriberCount,
    profileImageUrl,
    newQuestions,
  } = useInstructorStats();

  const { userData } = useProfile();

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
            <DailySmoothLineChart />
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
                <strong>{data.totalStudents}</strong>
              </div>
              <div className={styles.metricRow}>
                <span>평균 별점</span>
                <strong>{data.averageStars}</strong>
              </div>
              <div className={styles.metricRow}>
                <span>총 리뷰 수</span>
                <strong>{data.totalReviewCount}</strong>
              </div>
              <div className={styles.metricRow}>
                <span>구독자 수</span>
                <strong>{data.subscriberCount}</strong>
              </div>
            </div>
          </div>

          <div className={styles.wrapper}>
            <Image
              className={styles.image}
              src="/images/profile.webp"
              alt="profile"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* 2행: 달력(2) */}
        <div className={`${styles.card} ${styles.calendarCard}`}>
          {/* <CalendarOnly /> */}
          <Calendar lectures={[]} />
        </div>
        <div className={`${styles.card} ${styles.qaCard}`}>
          <QandAList />
        </div>
      </div>
    </div>
  );
}
