"use client";

import Header from "../common/header/header";
import TodoListCard from "../common/todoList/todoListCard";
import VideoView from "./__component/videoView/videoView";
import styles from "./instructorPage.module.scss";

export default function InstructorPage() {
  // const role = "instructor";
  // const params = useParams();
  // const courseId = params.courseId as string; // ✅ courseId 가져오기
  // const lectureId = params.lectureId as string;
  // const { roomId, socket } = useLiveSocket(courseId, lectureId, "instructor");

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
          <VideoView />
        </div>
        <div className={styles.checklistSection}>
          123
          <TodoListCard />
        </div>
      </div>
    </div>
  );
}
