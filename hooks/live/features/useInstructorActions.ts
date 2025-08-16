import axios from "axios";
import { getSession } from "next-auth/react";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import useLiveSocket, { SendIssueArgs } from "../useLiveSocket"; // 경로 수정 필요

// useInstructorActions 훅의 인자 타입을 정의합니다.
interface InstructorActionsProps {
  recognizedPose: string;
  handGesture: string;
  isTimerRunning: boolean;
  setIsTimerRunning: (isRunning: boolean) => void;
  todoSequence: number | null;
  setTodoSequence: Dispatch<SetStateAction<number | null>>;
  liveSocketData: ReturnType<typeof useLiveSocket>;
  lectureId: string;
}

export const useInstructorActions = ({
  recognizedPose,
  handGesture,
  isTimerRunning,
  setIsTimerRunning,
  todoSequence,
  setTodoSequence,
  liveSocketData,
  lectureId,
}: InstructorActionsProps) => {
  const {
    stompClient,
    roomInfo,
    roomId,
    chapter,
    sendChapterIssue,
    sendHelp,
    sendTodoCheck,
  } = liveSocketData;

  // 'Clap' 제스처 처리 -> 챕터 넘기기
  useEffect(() => {
    if (recognizedPose === "Clap" && stompClient && roomInfo?.email && roomId) {
      console.log("박수 제스처: 다음 챕터로");
      sendChapterIssue(stompClient, {
        type: "chapter-issue",
        issuer: roomInfo.email,
        lectureId: lectureId,
        roomId: roomId,
        chapterSequence: chapter?.chapterSequence ?? 0,
      });
    }
  }, [
    recognizedPose,
    stompClient,
    roomInfo,
    roomId,
    lectureId,
    sendChapterIssue,
    chapter?.chapterSequence,
  ]);

  // 'Closed_Fist' 제스처 처리 -> 도움 요청
  useEffect(() => {
    if (
      handGesture === "Closed_Fist" &&
      stompClient &&
      roomInfo?.email &&
      roomId
    ) {
      console.log("주먹 제스처: 도움 요청");
      sendHelp(stompClient, {
        type: "help",
        nickname: roomInfo.nickname,
        issuer: roomInfo.email,
        lectureId: lectureId,
        roomId: roomId,
      });
    }
  }, [handGesture, stompClient, roomInfo, roomId, lectureId, sendHelp]);

  // 'ThumbsUp' 제스처 처리 -> 할 일 체크 / 타이머 시작
  useEffect(() => {
    if (
      handGesture === "Thumb_Up" &&
      stompClient &&
      roomInfo?.email &&
      roomId &&
      chapter?.todos &&
      todoSequence !== null
    ) {
      const currentTodo = chapter.todos.find(
        (todo) => todo.sequence === todoSequence,
      );
      if (!currentTodo) return;

      if (currentTodo.type === "NORMAL") {
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
          const nextTodoSequence =
            chapter.todos[currentTodoIndex + 1]!.sequence;
          setTodoSequence(nextTodoSequence);
        } else {
          console.log("All todos for this chapter are complete.");
        }
      } else if (currentTodo.type === "TIMER" && !isTimerRunning) {
        // 타이머가 실행중이 아닐 때만 타이머를 시작합니다.
        setIsTimerRunning(true);
      }
    }
  }, [
    handGesture,
    stompClient,
    roomInfo,
    roomId,
    lectureId,
    chapter,
    todoSequence,
    sendTodoCheck,
    setIsTimerRunning,
    setTodoSequence,
    isTimerRunning, // isTimerRunning을 다시 의존성에 추가하여 정확한 상태를 참조하도록 합니다.
  ]);

  // 타이머 종료 시 호출될 함수
  const handleTimerCompletion = useCallback(() => {
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

  const toggleSelfMute = useCallback(async () => {
    if (!roomId || !roomInfo?.email || !lectureId) return;
    try {
      const session = await getSession(); // Get session
      const accessToken = session?.accessToken; // Extract accessToken
      console.log(accessToken);
      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      await axios.get("https://i13e104.p.ssafy.io/ws/v1/live/mute-audio", {
        params: {
          roomId,
          targetEmail: roomInfo.email,
          lectureId: Number(lectureId),
        },
        withCredentials: true,
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      console.log("Mute/unmute API call successful");
    } catch (error) {
      console.error("Failed to toggle mute:", error);
    }
  }, [roomId, roomInfo?.email, lectureId]);

  const toggleSelfVideo = useCallback(async () => {
    if (!roomId || !roomInfo?.email || !lectureId) return;
    try {
      const session = await getSession(); // Get session
      const accessToken = session?.accessToken; // Extract accessToken
      console.log(accessToken);
      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      await axios.get("https://i13e104.p.ssafy.io/ws/v1/live/mute-video", {
        params: {
          roomId,
          targetEmail: roomInfo.email,
          lectureId: Number(lectureId),
        },
        withCredentials: true,
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      console.log("Mute/unmute API call successful");
    } catch (error) {
      console.error("Failed to toggle mute:", error);
    }
  }, [roomId, roomInfo?.email, lectureId]);

  return { handleTimerCompletion, toggleSelfMute, toggleSelfVideo };
};
