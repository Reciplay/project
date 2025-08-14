"use client";

import { recognizeGesture } from "@/components/live/gestureRecognizer";
import VideoSection from "@/components/live/videoSection";
import useLivekitConnection from "@/hooks/live/useLivekitConnection";
import useLiveSocket from "@/hooks/live/useLiveSocket";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../common/header/header";
import type { ChapterCard } from "../common/todoList/todoListCard"; // 실제 경로로 수정
import TodoListCard from "../common/todoList/todoListCard";
import styles from "./instructorPage.module.scss";

type ServerTodoItem = {
  title: string;
  type: "NORMAL" | "TIMER";
  seconds: number | null;
  sequence: number;
};

export type ChapterTodoResponse = {
  type?: "chapter-issue";
  chapterId: number;
  chapterSequence: number;
  chapterName: string;
  numOfTodos: number;
  todos: ServerTodoItem[];
};

export default function InstructorPage() {
  const { data: session } = useSession();

  const params = useParams();
  const courseId = params.courseId as string;
  // const lectureId = String(1) as string;

  // ====================주석제거하기!!===================================
  const lectureId = params.lectureId as string;
  const {
    roomId,
    stompClient,
    sendChapterIssue,
    roomInfo,
    todo,
    // setTodo,
    sendHelp,
  } = useLiveSocket(courseId, lectureId, "instructor");

  const { joinRoom, leaveRoom, localTrack, remoteTracks } =
    useLivekitConnection();

  // 실시간 할 일 상태 -> 이 부분은 실제로는 서버에서 받아와야 함
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  // 페이지 로드 시 역할 적용
  useEffect(() => {
    const roleFromSession = (session?.role as string | null) ?? null;
    setRole(roleFromSession);
    setUserId(session?.user?.id ?? "");
  }, [session]);

  // role이 준비되면 joinRoom 실행
  useEffect(() => {
    if (!role) return;
    joinRoom(courseId, lectureId, role);
    return () => {
      leaveRoom();
    };
  }, [courseId, lectureId, role, joinRoom, leaveRoom]);

  const parsedChapterCard = useMemo<ChapterCard | undefined>(() => {
    // todo가 객체이며, chapterId 속성을 가지고 있는지 확인
    if (!todo || typeof todo !== "object" || !("chapterId" in todo)) {
      return undefined;
    }

    const data = todo as ChapterTodoResponse; // todo는 이미 객체이므로 바로 사용
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
  }, [todo]);

  const [handGesture, setHandGesture] = useState("");
  const lastHandGestureCheck = useRef(0);

  const handleHandGesture = useCallback((value: string) => {
    const now = Date.now();
    if (now - lastHandGestureCheck.current > 1000) {
      lastHandGestureCheck.current = now;
      setHandGesture((prev) => (prev === value ? prev : value));
      if (value && value !== "None") {
        console.log("Hand Gesture recognized:", value);
      }
    }
  }, []);

  const lastGestureCheck = useRef(0);
  const [recognizedPose, setPose] = useState("");
  const handleNodesDetected = useCallback((nodes: ReadonlyArray<unknown>) => {
    const now = Date.now();
    if (now - lastGestureCheck.current > 1000) {
      lastGestureCheck.current = now;
      if (Array.isArray(nodes) && nodes.length > 0) {
        const newGesture = recognizeGesture(nodes[0]);
        if (newGesture) {
          console.log("Gesture recognized:", newGesture);
          setPose(newGesture);
        }
      }
    }
  }, []); // recognizeGesture는 정적 import → deps 불필요
  // 추가: issuer 메모
  const issuer = useMemo(() => roomInfo?.email ?? "", [roomInfo?.email]);

  useEffect(() => {
    if (!stompClient || !issuer || !roomId) return;

    if (recognizedPose === "Clap") {
      sendChapterIssue(stompClient, {
        type: "chapter-issue",
        issuer,
        lectureId: Number(lectureId),
        roomId,
        chapterSequence: 1,
      });
    }

    if (handGesture === "Closed_Fist") {
      sendHelp(stompClient, {
        type: "help",
        nickname: "별명",
        issuer,
        lectureId,
        roomId,
      });
    }
  }, [
    stompClient,
    issuer,
    roomId,
    recognizedPose,
    handGesture,
    sendChapterIssue,
    sendHelp,
    lectureId,
  ]);

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
          <div style={{ padding: 24 }}>
            {/* 로컬 비디오 */}
            {localTrack ? (
              <VideoSection
                videoTrack={localTrack}
                participantIdentity={userId}
                onNodesDetected={handleNodesDetected}
                setGesture={handleHandGesture}
              />
            ) : (
              <p>비디오 연결 중...</p>
            )}

            {/* 원격 비디오 */}
            <div>
              {remoteTracks.map((remoteTrack) => {
                const video = remoteTrack.trackPublication.videoTrack;
                const audio = remoteTrack.trackPublication.audioTrack;

                console.log("🔍 remote remoteTrack:", remoteTrack);
                console.log("🎥 remote videoTrack:", video);
                console.log("🔊 remote audioTrack:", audio);

                if (!video) {
                  console.warn(
                    `⚠️ videoTrack 없음 → publication: ${remoteTrack.trackPublication.trackName}`,
                  );
                  return null;
                }

                return (
                  <VideoSection
                    key={remoteTrack.trackPublication.trackSid}
                    videoTrack={video}
                    audioTrack={audio}
                    participantIdentity={remoteTrack.participantIdentity}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.checklistSection}>
          {parsedChapterCard ? (
            <TodoListCard chapterCard={parsedChapterCard} />
          ) : (
            <div>
              <p>챕터 정보를 기다리고 있습니다...</p>
            </div>
          )}{" "}
          <TodoListCard chapterCard={parsedChapterCard} />
        </div>
      </div>
    </div>
  );
}
