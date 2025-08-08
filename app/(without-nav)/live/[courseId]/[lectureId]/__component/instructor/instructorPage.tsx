"use client";

import styles from "./instructorPage.module.scss";
import dynamic from 'next/dynamic';
import Header from "../common/header/header";
import TodoListCard from "../common/todoList/todoListCard";
import useLiveSocket from "@/hooks/live/useLiveSocket";
import { useParams } from "next/navigation";

const VideoChatTestPage = dynamic(() => import('@/app/videoChatTest/page'), {
  ssr: false,
});

export default function InstructorPage() {
  const role = 'instructor';
  const params = useParams();
  const courseId = params.courseId as string; // ✅ courseId 가져오기
  const lectureId = params.lectureId as string;
  const { roomId, socket } = useLiveSocket(courseId, lectureId, 'instructor');

  return (
    <div className={styles.container}>
      <Header
        lectureName="한식강의"
        // courseName={`강의 ID: ${lectureId}`}
        startTime={new Date("2025-08-02T14:00:00+09:00")}
        onLeave={() => {
          console.log("강의 떠나기");
        }}
      />

      <div className={styles.main}>
        <div className={styles.videoSection}>
          {/* 여기 */}
          <VideoChatTestPage />
        </div>
        <div className={styles.checklistSection}>
          <TodoListCard />
        </div>
      </div>
    </div>
  );
}
