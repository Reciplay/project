"use client";

import ChatBot from "@/components/chatbot/ChatBot";
import VideoSection from "@/components/live/videoSection";
import SetTimer from "@/components/timer/setTimer";
import { useGestureRecognition } from "@/hooks/live/features/useGestureRecognition";
import { useParticipantActions } from "@/hooks/live/features/useParticipantActions";
import { useStudentActions } from "@/hooks/live/features/useStudentActions";
import useLivekitConnection from "@/hooks/live/useLivekitConnection";
import useLiveSocket, { SendIssueArgs } from "@/hooks/live/useLiveSocket";
import { Track } from "livekit-client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  console.log("Session user name:", session?.user?.name);
  const params = useParams();
  const courseId = params.courseId as string;
  const lectureId = params.lectureId as string;

  // 2. State and Refs
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false); // Modified
  const [todoSequence, setTodoSequence] = useState<number | null>(null);

  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);

  const [isSttActive, setIsSttActive] = useState(false); // STT 활성화 상태 추가

  // 3. Custom Hooks for Live Logic
  const liveSocketData = useLiveSocket(courseId, lectureId, "student");

  //!태욱 챕터만 의존성 가지기 위해 수정
  const { chapter, stompClient, roomInfo, roomId, sendTodoCheck } =
    liveSocketData; // Destructure stompClient, roomInfo, roomId, sendTodoCheck

  const { joinRoom, leaveRoom, localTrack, localAudioTrack, remoteTracks } =
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
    setIsTimerRunning,
    todoSequence,
    setTodoSequence,
    liveSocketData,
    lectureId,
    sessionUserName: session?.user?.name || undefined, // Pass session.user.name
  });

  // New: Call useParticipantActions hook
  const { muteAudio, unMuteAudio, muteVideo, unMuteVideo } =
    useParticipantActions({
      roomId: liveSocketData.roomId,
      email: liveSocketData.roomInfo?.email,
      lectureId,
    });

  const toggleMic = useCallback(async () => {
    if (isMicMuted) {
      await unMuteAudio();
    } else {
      await muteAudio();
    }
    setIsMicMuted(!isMicMuted);
  }, [isMicMuted, muteAudio, unMuteAudio]);

  const toggleCamera = useCallback(async () => {
    if (isCameraOff) {
      await unMuteVideo();
    } else {
      await muteVideo();
    }
    setIsCameraOff(!isCameraOff);
  }, [isCameraOff, muteVideo, unMuteVideo]);
  const handleTimerCompletion = useCallback(() => {
    // Added handleTimerCompletion
    if (
      stompClient &&
      roomInfo?.email &&
      roomId &&
      chapter?.todos &&
      todoSequence !== null
    ) {
      const sendData: SendIssueArgs = {
        issuer: roomInfo.email,
        chapter: chapter.chapterSequence,
        todoSequence: todoSequence,
        lectureId: lectureId,
        roomId: roomId,
      };
      sendTodoCheck(stompClient, sendData);

      const currentTodoIndex = chapter.todos.findIndex(
        (todo) => todo.sequence === todoSequence,
      );
      if (
        currentTodoIndex > -1 &&
        currentTodoIndex < chapter.todos.length - 1
      ) {
        const nextTodoSequence = chapter.todos[currentTodoIndex + 1]!.sequence;
        setTodoSequence(nextTodoSequence);
      } else {
        console.log("All todos for this chapter are complete.");
      }
    }
  }, [
    stompClient,
    roomInfo,
    roomId,
    chapter,
    todoSequence,
    lectureId,
    sendTodoCheck,
    setTodoSequence,
  ]);

  // 4. Memoized Values
  const parsedChapterCard = useMemo<ChapterCard | undefined>(() => {
    // const { chapter } = liveSocketData;
    if (!chapter || typeof chapter !== "object" || !("chapterId" in chapter)) {
      return undefined;
    }
    setTodoSequence(1);
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
    console.log("Debugging instructorTrack:");
    console.log(
      "liveSocketData.instructorEmail:",
      liveSocketData.instructorEmail,
    );
    console.log("remoteTracks:", remoteTracks);
    const foundTrack = remoteTracks.find(
      (track) =>
        track.participantIdentity === liveSocketData.instructorEmail &&
        track.trackPublication.source === Track.Source.Camera,
    );
    console.log("foundTrack:", foundTrack);
    return foundTrack;
  }, [remoteTracks, liveSocketData.instructorEmail]);

  const timerTodo = useMemo(() => {
    // Added timerTodo
    if (parsedChapterCard && todoSequence !== null) {
      return parsedChapterCard.todos.find(
        (todo) => todo.sequence === todoSequence && todo.type === "TIMER",
      );
    }
    return undefined;
  }, [parsedChapterCard, todoSequence]);

  const currentTodo = useMemo(() => {
    // Added currentTodo
    if (parsedChapterCard && todoSequence !== null) {
      return parsedChapterCard.todos.find(
        (todo) => todo.sequence === todoSequence,
      );
    }
    return undefined;
  }, [parsedChapterCard, todoSequence]);

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
        </div>
        <div className={styles.localVideoOverlay}>
          {localTrack ? (
            <VideoSection
              videoTrack={localTrack}
              audioTrack={localAudioTrack}
              participantIdentity={userId}
              onNodesDetected={handleNodesDetected}
              setGesture={handleHandGesture}
              onWakeWordDetected={() => setIsSttActive(true)}
              isChatbotOpen={isSttActive}
            />
          ) : (
            <div className={styles.placeholder}>
              <p>비디오 연결 중...</p>
            </div>
          )}
        </div>

        <div className={styles.rightContainer}>
          <div className={styles.currentTodoSection}>
            <div className={styles.headerRow}>
              <h2>지금 해야 할 일</h2>
              {currentTodo ? ( // Modified conditional rendering
                <p>{currentTodo.title}</p>
              ) : (
                <p>강사님을 기다려 주세요</p>
              )}
              {currentTodo?.type === "TIMER" &&
                timerTodo && ( // Modified conditional rendering
                  <div className={styles.timer}>
                    <SetTimer
                      minutes={Math.floor((timerTodo.seconds ?? 0) / 60)}
                      seconds={(timerTodo.seconds ?? 0) % 60}
                      isRunning={isTimerRunning}
                      onFinish={() => {
                        setIsTimerRunning(false);
                        handleTimerCompletion();
                      }}
                    />
                  </div>
                )}
            </div>
          </div>

          <div className={styles.checklistSection}>
            <TodoListCard
              chapterCard={parsedChapterCard}
              currentTodoSequence={todoSequence}
            />
          </div>

          <div className={styles.chatBot}>
            <ChatBot
              isSttActive={isSttActive}
              onSttFinished={() => setIsSttActive(false)}
            />
          </div>
        </div>
      </div>
      <Header
        lectureName="한식강의"
        courseName={`강의 ID: ${lectureId}`}
        onExit={leaveRoom}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
      />
    </div>
  );
}
