"use client";

import styles from "./instructorPage.module.scss";
import Header from "../common/header/header";
import TodoListCard from "../common/todoList/todoListCard";
import { useParams } from "next/navigation";
import VideoSection from "@/components/live/videoSection";
import useLivekitConnection from "@/hooks/live/useLivekitConnection";
import { getSession } from "next-auth/react";
import { recognizeGesture } from "@/components/live/gestureRecognizer";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
// import useLiveSocket, { RoomInfo, SendChapterIssueArgs } from "@/hooks/live/useLiveSocket";
// import { useMemo } from 'react';
// import TodoListCardTimeline from '@/app/(without-nav)/live/[courseId]/[lectureId]/__component/common/todoList/todoListCard';
// import useLiveSocket from '@/hooks/useLiveSocket';
// import type { ChapterCard } from '@/types/yourTypes'; // 실제 경로로 수정

// type ServerTodoItem = {
//   title: string;
//   type: 'NORMAL' | 'TIMER';
//   seconds: number | null;
//   sequence: number;
// };

// type ChapterTodoResponse = {
//   type?: 'chapter-issue';
//   chapterId: number;
//   chapterSequence: number;
//   chapterName: string;
//   numOfTodos: number;
//   todos: ServerTodoItem[];
// };

// export default function InstructorPage() {
//   const { todo /* string */, /* ... */ } = useLiveSocket(courseId, lectureId, 'instructor');

//   // 수정된 부분: 서버 문자열 -> ChapterCard로 파싱해서 메모이즈
//   const parsedChapterCard = useMemo<ChapterCard | undefined>(() => {
//     if (!todo) return undefined;
//     try {
//       const data = JSON.parse(todo) as ChapterTodoResponse;
//       return {
//         chapterId: data.chapterId,
//         chapterSequence: data.chapterSequence,
//         chapterName: data.chapterName,
//         numOfTodos: data.numOfTodos,
//         todos: data.todos.map((t) => ({
//           title: t.title,
//           type: t.type,
//           seconds: t.seconds ?? null,
//           sequence: t.sequence,
//         })),
//       };
//     } catch {
//       return undefined;
//     }
//   }, [todo]); // 수정된 부분


export default function InstructorPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lectureId = params.lectureId as string;
  const { roomId, socket, stompClient, sendChapterIssue, roomInfo, todo, setTodo } = useLiveSocket(courseId, lectureId, "instructor");


  const { joinRoom, leaveRoom, localTrack, remoteTracks } =
    useLivekitConnection();

  // 실시간 할 일 상태 -> 이 부분은 실제로는 서버에서 받아와야 함
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  // 페이지 로드 시 역할 적용
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setRole(session?.role);
      setUserId(session?.user.id);
    };

    fetchSession();
  }, []);

  // role이 준비되면 joinRoom 실행
  useEffect(() => {
    if (!role) return;

    joinRoom(courseId, lectureId, role);
    return () => {
      leaveRoom();
    };
  }, [courseId, lectureId, role]);


  const [handGesture, setHandGesture] = useState("");
  const lastHandGestureCheck = useRef(0);

  const handleHandGesture = useCallback((value: string) => {
    const now = Date.now();
    if (now - lastHandGestureCheck.current > 1000) {
      lastHandGestureCheck.current = now;
      setHandGesture(prev => (prev === value ? prev : value));
      if (value && value !== "None") {
        console.log("Hand Gesture recognized:", value);
      }
    }
  }, []);

  const lastGestureCheck = useRef(0);
  const [recognizedPose, setPose] = useState("");
  const handleNodesDetected = useCallback((nodes) => {
    const now = Date.now();
    if (now - lastGestureCheck.current > 1000) {
      lastGestureCheck.current = now;
      if (nodes && nodes.length > 0) {
        const newGesture = recognizeGesture(nodes[0]);
        if (newGesture) {
          console.log("Gesture recognized:", newGesture);
          setPose(newGesture);
          console.log(recognizedPose)
        }
      }
    }
  }, []);



  const lastGestureSended = useRef(0)
  useEffect(() => {
    const now = Date.now()
    const issuer = roomInfo?.email
    // if (now - lastGestureSended.current > 2000) {
    //   lastGestureSended.current = now
      if (recognizedPose === 'Clap') {
        console.log('박수실행됨==================================')
        sendChapterIssue(stompClient, {
          type: "chapter-issue",
          issuer: issuer,
          lectureId: Number(lectureId),
          roomId: roomId,
          chapterSequence: 1
        })
      }
      // if (handGesture === 'Closed_Fist') {
      //     console.log('Closed_Fist==================================')
      //     sendHelp(props.stompClient, {
      //         type:"help",
      //         issuer : issuer,
      //         lectureId : lectureId,
      //         roomId : roomId,
      //     })
      // }


    // }
  }, [recognizedPose, handGesture])

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
                    `⚠️ videoTrack 없음 → publication: ${remoteTrack.trackPublication.trackName}`
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
          <TodoListCard
            chapterCard={parsedChapterCard}
          />
        </div>
      </div>
    </div>
  );
}
