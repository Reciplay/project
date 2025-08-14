"use client";

import { recognizeGesture } from "@/components/live/gestureRecognizer";
import VideoSection from "@/components/live/videoSection";
import useLivekitConnection from "@/hooks/live/useLivekitConnection";
import useLiveSocket from "@/hooks/live/useLiveSocket";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../common/header/header";
import type { ChapterCard } from "../common/todoList/todoListCard";
import TodoListCard from "../common/todoList/todoListCard";
import styles from "./studentPage.module.scss";

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

export default function StudentPage() {
  const { data: session } = useSession();

  const params = useParams();
  const courseId = params.courseId as string;

  // TODO: 실제 라우팅 사용할 때 주석 해제
  // const lectureId = params.lectureId as string;
  const lectureId = String(1) as string;

  // 역할은 학생이므로 세 번째 인자를 "student"로 두는 것을 권장
  const { roomId, stompClient, sendChapterIssue, roomInfo, todo, sendHelp } =
    useLiveSocket(courseId, lectureId, "student");

  const { joinRoom, leaveRoom, localTrack, remoteTracks } =
    useLivekitConnection();

  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  // 세션에서 role/id 읽기 (deps: session)
  useEffect(() => {
    const roleFromSession = (session?.role as string | null) ?? null;
    setRole(roleFromSession);
    setUserId(session?.user?.id ?? "");
  }, [session]);

  // role 준비되면 입장/퇴장 (deps: joinRoom, leaveRoom 포함)
  useEffect(() => {
    if (!role) return;
    joinRoom(courseId, lectureId, role);
    return () => {
      leaveRoom();
    };
  }, [courseId, lectureId, role, joinRoom, leaveRoom]);

  const parsedChapterCard = useMemo<ChapterCard | undefined>(() => {
    if (!todo || typeof todo !== "object" || !("chapterId" in todo)) {
      return undefined;
    }
    const data = todo as ChapterTodoResponse;
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

  // ✅ any 제거: 알 수 없는 배열로 받고 우리 로직에서 좁히기
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
  }, []);

  // issuer 메모 (deps: roomInfo?.email)
  const issuer = useMemo(() => roomInfo?.email ?? "", [roomInfo?.email]);

  // 제스처 전송 (필요한 의존성 모두 명시)
  useEffect(() => {
    if (!stompClient || !issuer || !roomId) return;

    if (recognizedPose === "Clap") {
      console.log("박수실행됨==================================");
      sendChapterIssue(stompClient, {
        type: "chapter-issue",
        issuer,
        lectureId: Number(lectureId),
        roomId,
        chapterSequence: 1,
      });
    }

    if (handGesture === "Closed_Fist") {
      console.log("Closed_Fist==================================");
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
          )}
          <TodoListCard chapterCard={parsedChapterCard} />
        </div>
      </div>
    </div>
  );
}
