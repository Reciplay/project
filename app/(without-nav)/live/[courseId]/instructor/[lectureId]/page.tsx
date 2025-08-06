// app/(without-nav)/live/instructor/[lectureId]/page.tsx
"use client";

import Header from "../../[lectureId]/__component/header/header";
import { Usable, use } from "react";
import VideoSection from "../../[lectureId]/__component/videoSection/videoSection";
import styles from "../../[lectureId]/page.module.scss"; // 학생쪽 스타일 재사용

export default function Page({
  params,
}: {
  params: Usable<{ lectureId: string }>;
}) {
  const { lectureId } = use(params);
  const courseId = "0";

  // 강사 화면에서는 courseName/lectureName을 다르게 줄 수 있음
  return (
    <div className={styles.container}>
      <Header
        lectureName="강사 실습 세션"
        courseName={`강의 ID: ${lectureId}`}
        startTime={new Date()}
        onLeave={() => {
          // 예: 뒤로 가기
          window.history.back();
        }}
      />

      <div className={styles.main}>
        <div className={styles.videoSection}>
          {/* VideoSection에 강사 역할을 알려주기 위한 prop 추가 (아래 수정 필요) */}
          <VideoSection
            lectureId={lectureId}
            courseId={courseId}
            role="instructor"
          />
        </div>

        {/* 강사에게는 체크리스트를 안 보여줘도 되고, 필요하면 재사용 */}
      </div>
    </div>
  );
}
