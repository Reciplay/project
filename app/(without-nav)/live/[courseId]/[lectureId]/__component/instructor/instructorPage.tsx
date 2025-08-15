"use client";

import ChatBot from "@/components/chatbot/chatBot";
import VideoSection from "@/components/live/videoSection";
import { useGestureRecognition } from "@/hooks/live/features/useGestureRecognition";
import { useInstructorActions } from "@/hooks/live/features/useInstructorActions";

import useLivekitConnection from "@/hooks/live/useLivekitConnection";
import useLiveSocket from "@/hooks/live/useLiveSocket";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Header from "../common/header/header";
import type { ChapterCard } from "../common/todoList/todoListCard";
import TodoListCard from "../common/todoList/todoListCard";
import styles from "./instructorPage.module.scss";
// Type Definitions (Assuming these are shared or defined elsewhere)
export type ChapterTodoResponse = {
  type?: "chapter-issue";
  chapterId: number;
  chapterSequence: number;
  chapterName: string;
  numOfTodos: number;
  todos: TodosResponse[];
};

export type TodosResponse = {
  title: string;
  type: "NORMAL" | "TIMER";
  seconds: number | null;
  sequence: number;
};

// Component
export default function InstructorPage() {
  // 1. Library Hooks
  const { data: session } = useSession();
  const params = useParams();
  const courseId = params.courseId as string;
  const lectureId = params.lectureId as string;

  // 2. State and Refs
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [todoSequence, setTodoSequence] = useState<number | null>(0);

  // 3. Custom Hooks for Live Logic
  const liveSocketData = useLiveSocket(courseId, lectureId, "instructor");

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

  useInstructorActions({
    recognizedPose,
    handGesture,
    isTimerRunning,
    setIsTimerRunning,
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
      <div className={styles.main}>
        <div className={styles.videoGrid}>
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
                <p>비디오 연결 중...</p>
              </div>
            )}
          </div>
          {remoteTracks.map((remoteTrack) => {
            const video = remoteTrack.trackPublication.videoTrack;
            const audio = remoteTrack.trackPublication.audioTrack;
            if (!video) return null;
            return (
              <div
                key={remoteTrack.trackPublication.trackSid}
                className={styles.videoTile}
              >
                <VideoSection
                  videoTrack={video}
                  audioTrack={audio}
                  participantIdentity={remoteTrack.participantIdentity}
                />
              </div>
            );
          })}
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
      <Header
        lectureName="한식강의"
        courseName={`강의 ID: ${lectureId}`}
        onExit={() => {
          console.log("강의 떠나기");
        }}
      />
    </div>
  );
}
