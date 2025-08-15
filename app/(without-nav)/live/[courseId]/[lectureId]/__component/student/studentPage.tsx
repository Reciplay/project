"use client";

// import ChatBot from "@/components/chatbot/chatBot";
import VideoSection from "@/components/live/videoSection";
// import { useGestureRecognition } from "@/hooks/live/features/useGestureRecognition";
// import { useStudentActions } from "@/hooks/live/features/useStudentActions";
import ChatBot from "@/components/chatbot/chatBot";
import { useGestureRecognition } from "@/hooks/live/features/useGestureRecognition";
import { useStudentActions } from "@/hooks/live/features/useStudentActions";
import useLivekitConnection from "@/hooks/live/useLivekitConnection";
import useLiveSocket from "@/hooks/live/useLiveSocket";
import { Track } from "livekit-client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Header from "../common/header/header";
import type { ChapterCard } from "../common/todoList/todoListCard";
import TodoListCard from "../common/todoList/todoListCard";
import { TodosResponse } from "../instructor/instructorPage";
import styles from "./studentPage.module.scss";

// Type Definitions
export type ChapterTodoResponse = {
  type?: "chapter-issue";
  chapterId: number;
  chapterSequence: number;
  chapterName: string;
  numOfTodos: number;
  todos: TodosResponse[];
};

// Component
export default function StudentPage() {
  // 1. Library Hooks
  const { data: session } = useSession();
  const params = useParams();
  const courseId = params.courseId as string;
  const lectureId = params.lectureId as string;

  // 2. State and Refs
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  // !태욱 setIsTimerRunning이 사용되지 않아서 임시로 없앴음
  // const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const [isTimerRunning] = useState<boolean>(false);
  const [todoSequence, setTodoSequence] = useState<number | null>(0);

  // 3. Custom Hooks for Live Logic
  const liveSocketData = useLiveSocket(courseId, lectureId, "student");

  //!태욱 챕터만 의존성 가지기 위해 수정
  const { chapter } = liveSocketData;

  const { joinRoom, leaveRoom, localTrack, remoteTracks } =
    useLivekitConnection();
  const {
    handGesture,
    recognizedPose,
    handleHandGesture,
    handleNodesDetected,
  } = useGestureRecognition();

  useStudentActions({
    recognizedPose,
    handGesture,
    isTimerRunning,
    todoSequence,
    setTodoSequence,
    liveSocketData,
    lectureId,
  });

  // 4. Memoized Values
  const parsedChapterCard = useMemo<ChapterCard | undefined>(() => {
    // const { chapter } = liveSocketData;
    if (!chapter || typeof chapter !== "object" || !("chapterId" in chapter)) {
      return undefined;
    }
    const data = chapter as ChapterTodoResponse;
    return {
      chapterId: data.chapterId,
      chapterSequence: data.chapterSequence,
      chapterName: data.chapterName,
      numOfTodos: data.numOfTodos,
      todos: data.todos.map((t) => ({
        title: t.title,
        type: t.type,
        seconds: t.seconds ?? null,
        sequence: t.sequence,
      })),
    };
  }, [chapter]);
  //!태욱 챕터만 의존성 가지기 위해 수정
  // }, [liveSocketData.chapter]);

  const instructorTrack = useMemo(() => {
    return remoteTracks.find(
      (track) =>
        track.participantIdentity === liveSocketData.instructorEmail &&
        track.trackPublication.source === Track.Source.Camera,
    );
  }, [remoteTracks, liveSocketData.instructorEmail]);

  // 5. Effects
  useEffect(() => {
    if (session) {
      setRole(session.role ?? null);
      setUserId(session.user?.id ?? "");
    }
  }, [session]);

  useEffect(() => {
    if (role) {
      joinRoom(courseId, lectureId, role);
    }
    return () => {
      leaveRoom();
    };
  }, [courseId, lectureId, role, joinRoom, leaveRoom]);

  // 6. Render
  return (
    <div className={styles.container}>
      <Header
        lectureName="한식강의"
        courseName={`강의 ID: ${lectureId}`}
        onExit={() => {
          console.log("강의 떠나기");
        }}
      />
      <div className={styles.main}>
        <div className={styles.videoGrid}>
          <div className={styles.videoTile}>
            {instructorTrack?.trackPublication?.videoTrack != null ? (
              <VideoSection
                videoTrack={instructorTrack.trackPublication.videoTrack}
                audioTrack={instructorTrack.trackPublication.audioTrack}
                participantIdentity={instructorTrack.participantIdentity}
              />
            ) : (
              <div className={styles.placeholder}>
                <p>강사 화면을 기다리고 있습니다...</p>
              </div>
            )}
          </div>

          <div className={styles.videoTile}>
            {localTrack ? (
              <VideoSection
                videoTrack={localTrack}
                participantIdentity={userId}
                onNodesDetected={handleNodesDetected}
                setGesture={handleHandGesture}
              />
            ) : (
              <div className={styles.placeholder}>
                <p>내 비디오 연결 중...</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightContainer}>
          <div className={styles.checklistSection}>
            <TodoListCard chapterCard={parsedChapterCard} />
          </div>
          <div className={styles.chatBot}>
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  );
}
