"use client";

import { useInstructorStats } from "@/hooks/dashboard/useStats";
import { usePostQnaAnswer } from "@/hooks/qna/usePostQnaAnswer";
import QandAList from "../__components/q&alist/q&aList";
import DashboardCalendar from "./__components/dashboardCalendar";
import DashboardChart from "./__components/dashboardChart";
import DashboardProfile from "./__components/dashboardProfile";
import styles from "./page.module.scss";

export default function Page() {
  const { postAnswer } = usePostQnaAnswer();

  const { data: statData, loading, error } = useInstructorStats();
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

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        {/* 1행: 차트(1) */}
        <DashboardChart />

        {/* 1행: 프로필(1) */}
        <DashboardProfile statData={statData} loading={loading} error={error} />

        {/* 2행: 달력(2) */}
        <DashboardCalendar />

        <div className={`${styles.card} ${styles.qaCard}`}>
          <QandAList
            questions={statData?.newQuestions ?? []}
            onSubmitAnswer={handleSubmitAnswer}
          />
        </div>
      </div>
    </div>
  );
}
