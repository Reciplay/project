"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { getSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import SockJS from "sockjs-client";

type SockInstance = InstanceType<typeof SockJS>;

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

export default function useLiveSocket(
  courseId: string,
  lectureId: string,
  role: "instructor" | "student",
) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<SockInstance | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [subscription, setSubscription] = useState<StompSubscription | null>(
    null,
  );
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [todo, setTodo] = useState<ChapterTodoResponse | null>(null);

  /** 1. roomId & roomInfo 가져오기 */
  const fetchRoomId = useCallback(async () => {
    try {
      const res = await restClient.post<ApiResponse<RoomInfo>>(
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
    (client: Client, id: string) => {
      if (!roomInfo || !roomInfo.nickname) {
        console.error("❌ nickname 없음, join 전송 취소");
        return;
      }

      const message = {
        type: "join",
        issuer: roomInfo.email,
        receiver: null,
        nickname: "roomInfo.nickname",
        lectureId: lectureId,
        roomId: id,
        state: ["noting"],
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

  // 1) 구독 콜백에서 chapter-issue 응답을 스토어에 저장

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

        console.log(`subscribe : /ws/v1/topic/room/${id}`);

        const sub = client.subscribe(
          `/ws/v1/topic/room/${id}`,
          (message: IMessage) => {
            try {
              const data = JSON.parse(message.body);
              console.log("📦 받은 데이터 구조:", data);
              console.log(
                "🔍 타입 추론 결과:",
                typeof data,
                Array.isArray(data) ? "배열" : "객체",
              );
              console.dir(data, { depth: null }); // 중첩 구조까지 전부 출력
              // 서버가 보낼 수 있는 형태:
              // 1) { type: 'chapter-issue', chapterId, chapterSequence, chapterName, numOfTodos, todos: [...] }
              // 2) { chapterId, chapterSequence, chapterName, numOfTodos, todos: [...] }  (type 없이)

              // 사용 안되길래 주석
              // const isChapterIssue = (
              //   data: any,
              // ): data is ChapterTodoResponse => {
              //   return (
              //     (data?.type === "chapter-issue" || data?.chapterId) &&
              //     typeof data?.chapterId === "number" &&
              //     typeof data?.chapterSequence === "number" &&
              //     typeof data?.numOfTodos === "number" &&
              //     Array.isArray(data?.todos)
              //   );
              // };
              if (data) {
                // ✅ 도착 로그(받았다)
                console.log("⬅️ Received ChapterTodoResponse:", data);

                // 사용 안되길래 주석
                // const chapter: ChapterTodoResponse = {
                //   type: data.type ?? "chapter-issue",
                //   chapterId: data.chapterId,
                //   chapterSequence: data.chapterSequence,
                //   chapterName: data.chapterName,
                //   numOfTodos: data.numOfTodos,
                //   todos: data.todos,
                // };
                setTodo(data);
                console.log("📝 ChapterTodoResponse 저장:", data);
                return data;
              }

              // 그 외 다른 이벤트들은 기존처럼 로그
              console.log(`📩 메시지 수신 [room/${id}]`, data);
            } catch (e) {
              console.error("❌ 메시지 파싱 실패:", e, message.body);
            }
          },
        );
        console.log(`✅ 구독 성공: /ws/v1/topic/room/${id}`);
        setSubscription(sub);

        sendJoin(client, id);
        // if (roomInfo) {
        //   sendChapterIssue(client, {
        //     type: 'chapter-issue',
        //     issuer: roomInfo.email,
        //     lectureId: roomInfo.lectureId,
        //     roomId: id,
        //     chapterSequence: 1,
        //     chapterName: '테스트 챕터',
        //   });
        // }
      };

      // 개인채널 구독
      client.onConnect = (frame) => {
        console.log("✅ Connected : ", frame);

        setStompClient(client);

        console.log(`subscribe : /ws/v1/user/queue/${id}`);

        const sub = client.subscribe(
          `/ws/v1/user/queue/${id}`,
          (message: IMessage) => {
            try {
              const data = JSON.parse(message.body);
              console.log("📦 받은 데이터 구조:", data);
              console.log(
                "🔍 타입 추론 결과:",
                typeof data,
                Array.isArray(data) ? "배열" : "객체",
              );
              console.dir(data, { depth: null }); // 중첩 구조까지 전부 출력
              // 서버가 보낼 수 있는 형태:
              // 1) { type: 'chapter-issue', chapterId, chapterSequence, chapterName, numOfTodos, todos: [...] }
              // 2) { chapterId, chapterSequence, chapterName, numOfTodos, todos: [...] }  (type 없이)

              // 사용 안되길래 주석
              // const isChapterIssue = (
              //   data: any,
              // ): data is ChapterTodoResponse => {
              //   return (
              //     (data?.type === "chapter-issue" || data?.chapterId) &&
              //     typeof data?.chapterId === "number" &&
              //     typeof data?.chapterSequence === "number" &&
              //     typeof data?.numOfTodos === "number" &&
              //     Array.isArray(data?.todos)
              //   );
              // };
              if (data) {
                // ✅ 도착 로그(받았다)
                console.log("⬅️ Received ChapterTodoResponse:", data);

                // 사용 안되길래 주석
                // const chapter: ChapterTodoResponse = {
                //   type: data.type ?? "chapter-issue",
                //   chapterId: data.chapterId,
                //   chapterSequence: data.chapterSequence,
                //   chapterName: data.chapterName,
                //   numOfTodos: data.numOfTodos,
                //   todos: data.todos,
                // };
                setTodo(data);
                console.log("📝 ChapterTodoResponse 저장:", data);
                return data;
              }

              // 그 외 다른 이벤트들은 기존처럼 로그
              console.log(`📩 메시지 수신 [room/${id}]`, data);
            } catch (e) {
              console.error("❌ 메시지 파싱 실패:", e, message.body);
            }
          },
        );
        console.log(`✅ 개인 구독 성공: /ws/v1/user/queue/${id}`);
        setSubscription(sub);

        sendJoin(client, id);
        // if (roomInfo) {
        //   sendChapterIssue(client, {
        //     type: 'chapter-issue',
        //     issuer: roomInfo.email,
        //     lectureId: roomInfo.lectureId,
        //     roomId: id,
        //     chapterSequence: 1,
        //     chapterName: '테스트 챕터',
        //   });
        // }
      };

      client.onStompError = (frame) => {
        console.error("❌ STOMP 오류", frame.headers["message"]);
      };

      client.activate();
    },
    [sendJoin],
  );

  // 2) 강사용: chapter-issue 보내기 함수
  type SendChapterIssueArgs = {
    type: string;
    issuer: string; // instructor email
    lectureId: number | string;
    roomId: string;
    chapterSequence: number;
    chapterName?: string; // 서버가 필요 없으면 생략 가능
  };

  type SendHelpIssueArgs = {
    type: string;
    issuer: string;
    nickname: string;
    lectureId: number | string;
    roomId: string;
  };

  const sendChapterIssue = useCallback(
    (client: Client, args: SendChapterIssueArgs) => {
      const payload = {
        type: "chapter-issue",
        roomId: args.roomId,
        issuer: args.issuer,
        chapterSequence: Number(args.chapterSequence),
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

  const sendHelp = useCallback((client: Client, args: SendHelpIssueArgs) => {
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

  // const sendTodoCheck = useCallback((client: Client, args: SendHelpIssueArgs) => {
  //   const payload = {
  //     type: "todo-check",
  //     issuer:
  //   }
  // })

  /** 4. cleanup */
  const cleanupConnection = useCallback(() => {
    console.log("🧹 useLiveSocket cleanup 실행");

    if (subscription) {
      subscription.unsubscribe();
      console.log("📴 구독 해제 완료");
    }

    if (stompClient) {
      stompClient.reconnectDelay = 0; // 재연결 시도 방지
      stompClient.deactivate();
      console.log("🛑 STOMP 연결 해제");
    }

    socket?.close();
  }, [subscription, stompClient, socket]);

  /** 마운트 시 roomId 요청 */
  useEffect(() => {
    fetchRoomId();
  }, [fetchRoomId]);

  /** roomId 변경 시 소켓 연결 */
  useEffect(() => {
    if (roomId) connectSocket(roomId);
    return () => cleanupConnection();
  }, [roomId]);

  return {
    roomId,
    socket,
    stompClient,
    sendChapterIssue,
    roomInfo,
    todo,
    setTodo,
    sendHelp,
    // sendCheck
  };
}
