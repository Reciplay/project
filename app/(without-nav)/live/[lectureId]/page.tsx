"use client";

import { Usable, use } from "react";
import Header from "./__component/header/header";
import { TodoList } from "./__component/todoList/todoList";
import VideoSection from "./__component/videoSection/videoSection";
import styles from "./page.module.scss";

export default function Page({
  params,
}: {
  params: Usable<{ lectureId: string }>;
}) {
  const { lectureId } = use(params);
  const courseId = "0";

  return (
    <div className={styles.container}>
      <Header
        lectureName="스마트 팩토리 프론트엔드 실습"
        courseName={`강의 ID: ${lectureId}`}
        startTime={new Date("2025-08-02T14:00:00+09:00")}
        onLeave={() => {
          console.log("강의 떠나기");
        }}
      />

      <div className={styles.main}>
        <div className={styles.videoSection}>
          <VideoSection
            lectureId={lectureId}
            courseId={courseId}
            role="student"
          />
        </div>
        <div className={styles.checklistSection}>
          <div className={styles.checklistBox}>
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}
