"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { getSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import SockJS from "sockjs-client";

export type SendChapterIssueArgs = {
  type: string;
  roomId: string;
  issuer: string;
  chapterSequence: number;
  lectureId: number;
  chapterName?: string;
};

export interface RoomInfo {
  token: string;
  roomId: string;
  nickname: string;
  email: string;
  lectureId: number;
}

type TodoType = "NORMAL" | "TIMER" | "ACTION";

interface ChapterTodoItem {
  title: string;
  type: TodoType;
  seconds: number | null;
  sequence: number;
}

export interface ChapterTodoResponse {
  // 서버 응답 예시 기준
  type?: "chapter-issue"; // 서버가 type을 넣어줄 수도 있으니 optional
  chapterId: number;
  chapterSequence: number;
  chapterName: string;
  numOfTodos: number;
  todos: ChapterTodoItem[];
}

export type SendIssueArgs = {
  type?: string;
  issuer: string;
  roomId?: string;
  lectureId: string;
  chapterSequence?: number;
  chapterName?: string;
  nickname?: string;
  chapter?: number;
  role?: string;
  todoSequence?: number;
};

export default function useLiveSocket(
  courseId: string,
  lectureId: string,
  role: "instructor" | "student",
) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<SockJS | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [subscriptions, setSubscriptions] = useState<StompSubscription[]>([]);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [chapter, setChapter] = useState<ChapterTodoResponse | null>(null);
  // const [instructorEmail, setInstructorEmail] = useState<string>(
  //   "InstructorEmail Initial Value",
  // );
  const [instructorEmail, setInstructorEmail] = useState<string>("");
  /** 1. roomId & roomInfo 가져오기 */
  const fetchRoomId = useCallback(async () => {
    try {
      const res = await restClient.post<ApiResponse<RoomInfo>>(
        // 그냥 api 서버
        `/livekit/${role}/token`,
        { lectureId, courseId },
        { requireAuth: true },
      );

      if (res.data.status !== "success") {
        throw new Error(`Failed to get token: ${res.data.message}`);
      }

      const info = res.data.data;
      console.log("roomInfo raw:", info);
      console.log("roomId:", info.roomId);
      setRoomInfo(info);
      setRoomId(info.roomId);
    } catch (e) {
      console.error("roomId 요청 실패:", e);
    }
  }, [courseId, lectureId, role]);

  /** 2. join 메시지 발송 */
  const sendJoin = useCallback(
    (client: Client, id: string, role: string) => {
      if (!roomInfo || !roomInfo.nickname) {
        console.error("❌ nickname 없음, join 전송 취소");
        return;
      }
      // console.log(`내부 클로저 specialRole, ${specialRole}`);

      // if (typeof specialRole !== "string" || specialRole.trim() === "") {
      //   // 필요하면 여기서 로그 남기세요.
      //   console.log("특수 권한 없음: join 미전송");
      //   return;
      // }

      const message = {
        type: "join",
        issuer: roomInfo.email,
        receiver: null,
        nickname: "roomInfo.nickname",
        lectureId: Number(lectureId),
        roomId: id,
        state: ["noting"],
        role: role,
      };
      // 이 주소(/app/join)로 메시지 보낼게
      client.publish({
        destination: "/ws/v1/app/join",
        body: JSON.stringify(message),
      });
      console.log(`➡️ Sent /ws/v1/app/join: ${JSON.stringify(message)}`);
    },
    [roomInfo, lectureId],
  );

  const sendRejoin = useCallback(
    (client: Client, id: string, receiver: string, role: string) => {
      if (!roomInfo || !roomInfo.nickname) {
        console.error("❌ nickname 없음, join 전송 취소");
        return;
      }

      if (roomInfo.email === receiver) {
        console.log(
          "⏩ issuer와 receiver가 동일하여 re-join을 보내지 않습니다.",
        );
        return;
      }

      const message = {
        type: "re-join",
        issuer: roomInfo.email,
        receiver: receiver,
        nickname: "roomInfo.nickname",
        lectureId: Number(lectureId),
        roomId: id,
        state: ["video-on", "audio-off"],
        role: role,
      };
      // 이 주소(/app/join)로 메시지 보낼게
      client.publish({
        destination: "/ws/v1/app/re-join",
        body: JSON.stringify(message),
      });
      console.log(`➡️ Sent /ws/v1/app/re-join: ${JSON.stringify(message)}`);
    },
    [roomInfo, lectureId],
  );

  useEffect(() => {
    console.log(`강사 이메일 변경, ${instructorEmail}`);
  }, [instructorEmail]);

  /** 3. SockJS + STOMP 연결 */
  const connectSocket = useCallback(
    async (id: string) => {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        console.error("❌ accessToken 없음");
        return;
      }

      const sock = new SockJS("http://i13e104.p.ssafy.io:8081/ws/v1/sub");
      setSocket(sock); // cleanup에서 close 가능

      const client = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
        debug: (str) => {
          console.log("%c[STOMP DEBUG]", "color: orange;", str);
        },
      });

      client.onConnect = (frame) => {
        console.log("✅ Connected : ", frame);
        setStompClient(client);

        const newSubs: StompSubscription[] = [];

        const handleMessage = (message: IMessage, source: string) => {
          try {
            const data = JSON.parse(message.body);
            console.log(`📦 받은 데이터 구조 [${source}]:`, data);

            if (role === "student" && data.type === "re-join" && data.issuer) {
              console.log(`[학생] 강사 이메일 수신: ${data.issuer}`);
              setInstructorEmail(data.issuer);
            }

            if (
              role === "instructor" &&
              data.type === "join" &&
              data.issuer !== roomInfo?.email
            ) {
              console.log(
                `👨‍🏫 Instructor received join from ${data.issuer}. Sending re-join.`,
              );
              if (client && id) {
                sendRejoin(client, id, data.issuer, "ROLE_INSTRUCTOR");
                setInstructorEmail(data.issuer);
              }
            }

            const isChapterIssue = (data): data is ChapterTodoResponse => {
              return (
                (data?.type === "chapter-issue" || data?.chapterId) &&
                typeof data?.chapterId === "number" &&
                typeof data?.chapterSequence === "number" &&
                typeof data?.numOfTodos === "number" &&
                Array.isArray(data?.todos)
              );
            };

            if (isChapterIssue(data)) {
              console.log(
                `⬅️ Received ChapterTodoResponse from ${source}:`,
                data,
              );
              setChapter(data);
              console.log("📝 ChapterTodoResponse 저장:", data);
            } else {
              console.log(`📩 메시지 수신 [${source}]`, data);
            }
          } catch (e) {
            console.error(`❌ 메시지 파싱 실패 [${source}]:`, e, message.body);
          }
        };

        // Topic 구독
        console.log(`subscribe : /ws/v1/topic/room/${id}`);
        const topicSub = client.subscribe(
          `/ws/v1/topic/room/${id}`,
          (message) => handleMessage(message, "topic"),
        );
        console.log(`✅ 공동 구독 성공: /ws/v1/topic/room/${id}`);
        newSubs.push(topicSub);

        // 개인 채널 구독
        console.log(`subscribe : /ws/v1/user/queue/${id}`);
        const userSub = client.subscribe(`/ws/v1/user/queue/${id}`, (message) =>
          handleMessage(message, "user-queue"),
        );
        console.log(`✅ 개인 구독 성공: /ws/v1/user/queue/${id}`);
        newSubs.push(userSub);

        setSubscriptions(newSubs);
        sendJoin(client, id, session.role!);
      };

      client.onStompError = (frame) => {
        console.error("❌ STOMP 오류", frame.headers["message"]);
      };

      client.activate();
    },
    [sendJoin, sendRejoin],
  );

  const sendChapterIssue = useCallback(
    (client: Client, args: SendIssueArgs) => {
      const payload = {
        type: "chapter-issue",
        roomId: args.roomId,
        issuer: args.issuer,
        // 다음 챕터 넘버를 보내야함
        chapterSequence: Number(args.chapterSequence) + 1,
        lectureId: Number(args.lectureId),
        ...(args.chapterName ? { chapterName: args.chapterName } : {}),
      };

      client.publish({
        destination: "/ws/v1/app/chapter-issue",
        body: JSON.stringify(payload),
      });
      // ✅ 출발 로그(보냈다)
      console.log("➡️ Sent /ws/v1/app/chapter-issue:", payload);
    },
    [],
  );

  const sendHelp = useCallback((client: Client, args: SendIssueArgs) => {
    const payload = {
      type: "help",
      issuer: args.issuer,
      nickname: args.nickname,
      lectureId: Number(args.lectureId),
      roomId: args.roomId,
    };

    client.publish({
      destination: "/ws/v1/app/help",
      body: JSON.stringify(payload),
    });
    console.log("➡️ Sent /ws/v1/app/help:", payload);
  }, []);

  const sendTodoCheck = useCallback((client: Client, args: SendIssueArgs) => {
    const payload = {
      type: "todo-check",
      issuer: args.issuer,
      chapter: args.chapter,
      todoSequence: args.todoSequence,
      lectureId: lectureId,
      roomId: roomId,
    };
    client.publish({
      destination: "/ws/v1/app/todo-check",
      body: JSON.stringify(payload),
    });
    console.log("➡️ Sent /ws/v1//app/todo-check", payload);
  }, []);

  /** 4. cleanup */
  const cleanupConnection = useCallback(() => {
    console.log("🧹 useLiveSocket cleanup 실행");

    subscriptions.forEach((sub, index) => {
      try {
        sub.unsubscribe();
        console.log(`📴 구독 ${index + 1} 해제 완료`);
      } catch (e) {
        console.error(`구독 ${index + 1} 해제 실패:`, e);
      }
    });
    setSubscriptions([]);

    if (stompClient) {
      stompClient.reconnectDelay = 0; // 재연결 시도 방지
      stompClient.deactivate();
      console.log("🛑 STOMP 연결 해제");
    }

    socket?.close();
  }, [subscriptions, stompClient, socket]);

  /** 마운트 시 roomId 요청 */
  useEffect(() => {
    fetchRoomId();
  }, [fetchRoomId]);

  /** roomId 변경 시 소켓 연결 */
  useEffect(() => {
    if (roomId) {
      connectSocket(roomId);
    }
    return () => {
      cleanupConnection();
    };
  }, [roomId]);

  return {
    roomId,
    socket,
    stompClient,
    sendChapterIssue,
    roomInfo,
    chapter,
    setChapter,
    sendHelp,
    sendRejoin,
    instructorEmail,
    sendTodoCheck,
  };
}
