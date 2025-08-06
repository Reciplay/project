"use client";

import { Usable, use } from "react";
import Header from "./__component/header/header";
import styles from "./page.module.scss";
import TodoListCard from "./__component/todoList/todoListCard"

import dynamic from 'next/dynamic';
const VideoChatTestPage = dynamic(() => import('@/app/videoChatTest/page'), {
  ssr: false,
});

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
        lectureName="한식강의"
        courseName={`강의 ID: ${lectureId}`}
        startTime={new Date("2025-08-02T14:00:00+09:00")}
        onLeave={() => {
          console.log("강의 떠나기");
        }}
      />

      <div className={styles.main}>
        <div className={styles.videoSection}>
          {/* 여기 */}
          <VideoChatTestPage></VideoChatTestPage>
        </div>
        <div className={styles.checklistSection}>
          <TodoListCard />
        </div>
      </div>
    </div>
  );
}
