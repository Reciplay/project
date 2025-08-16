"use client";

import ChatBot from "@/components/chatbot/chatBot";
import VideoSection from "@/components/live/videoSection";
import { useGestureRecognition } from "@/hooks/live/features/useGestureRecognition";
import { useInstructorActions } from "@/hooks/live/features/useInstructorActions";

import SetTimer from "@/components/timer/setTimer";
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
  const [todoSequence, setTodoSequence] = useState<number | null>(null);

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

  const { handleTimerCompletion, toggleSelfMute } = useInstructorActions({
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

  const timerTodo = useMemo(() => {
    if (parsedChapterCard && todoSequence !== null) {
      return parsedChapterCard.todos.find(
        (todo) => todo.sequence === todoSequence && todo.type === "TIMER",
      );
    }
    return undefined;
  }, [parsedChapterCard, todoSequence]);
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

  useEffect(() => {
    // 챕터 데이터가 로드되고, 시퀀스가 아직 설정되지 않았을 때
    // 첫 번째 투두의 시퀀스로 초기화합니다.
    if (
      chapter &&
      chapter.todos &&
      chapter.todos.length > 0 &&
      todoSequence === null
    ) {
      setTodoSequence(chapter.todos[0]!.sequence);
    }
  }, [chapter, todoSequence]);

  // 6. Render
  console.log("[InstructorPage DEBUG]", {
    todoSequence,
    isTimerRunning,
    timerTodo,
    chapterTodos: parsedChapterCard?.todos,
  });

  return (
    <div className={styles.container}>
      <div className={styles.timerOverlay}>
        <SetTimer
          minutes={Math.floor((timerTodo?.seconds ?? 0) / 60)}
          seconds={(timerTodo?.seconds ?? 0) % 60}
          isRunning={isTimerRunning}
          onFinish={() => {
            setIsTimerRunning(false);
            handleTimerCompletion();
          }}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.videoGrid}>
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
                <div className={styles.identityOverlay}>
                  <p>{remoteTrack.participantIdentity}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.localVideoOverlay}>
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

        <div className={styles.rightContainer}>
          <div className={styles.checklistSection}>
            <TodoListCard
              chapterCard={parsedChapterCard}
              currentTodoSequence={todoSequence}
            />
          </div>

          <div className={styles.chatBot}>
            <ChatBot />
          </div>
        </div>
      </div>
      <Header
        lectureName="한식강의"
        courseName={`강의 ID: ${lectureId}`}
        onExit={leaveRoom}
        onToggleMic={toggleSelfMute}
      />
    </div>
  );
}
