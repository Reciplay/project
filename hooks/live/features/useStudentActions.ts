import { Dispatch, SetStateAction, useEffect } from "react";
import useLiveSocket, { SendIssueArgs } from "../useLiveSocket"; // 경로 수정 필요

// useStudentActions 훅의 인자 타입을 정의합니다.
interface StudentActionsProps {
  recognizedPose: string;
  handGesture: string;
  isTimerRunning: boolean;
  todoSequence: number | null;
  setTodoSequence: Dispatch<SetStateAction<number | null>>;
  liveSocketData: ReturnType<typeof useLiveSocket>;
  lectureId: string;
  sessionUserName?: string; // Added sessionUserName prop
}

export const useStudentActions = ({
  // recognizedPose,
  handGesture,
  isTimerRunning,
  todoSequence,
  setTodoSequence,
  liveSocketData,
  lectureId,
  sessionUserName, // Destructure sessionUserName
}: StudentActionsProps) => {
  const { stompClient, roomInfo, roomId, chapter, sendHelp, sendTodoCheck } =
    liveSocketData;

  // 'Closed_Fist' 제스처 처리 -> 도움 요청
  useEffect(() => {
    console.log("[Closed_Fist DEBUG] handGesture:", handGesture);
    console.log("[Closed_Fist DEBUG] stompClient:", !!stompClient);
    console.log("[Closed_Fist DEBUG] roomInfo?.email:", roomInfo?.email);
    console.log("[Closed_Fist DEBUG] roomInfo.nickname:", roomInfo?.nickname);
    console.log("[Closed_Fist DEBUG] roomId:", roomId);

    if (
      handGesture === "Closed_Fist" &&
      stompClient &&
      roomInfo?.email &&
      roomId
    ) {
      console.log("주먹 제스처: 도움 요청");
      sendHelp(stompClient, {
        type: "help",
        nickname: roomInfo.nickname || sessionUserName || "익명 사용자", // Use roomInfo.nickname or sessionUserName
        issuer: roomInfo.email,
        lectureId: lectureId,
        roomId: roomId,
      });
    }
  }, [handGesture, stompClient, roomInfo, roomId, lectureId, sendHelp]);

  // 'ThumbsUp' 제스처 처리 -> 할 일 체크
  useEffect(() => {
    if (
      handGesture === "ThumsUp" &&
      stompClient &&
      roomInfo?.email &&
      roomId &&
      chapter?.todos &&
      todoSequence !== null
    ) {
      console.log("엄지척 제스처: 할 일 체크");
      const currentTodo = chapter.todos[todoSequence];
      if (!currentTodo) return;

      const sendData: SendIssueArgs = {
        issuer: roomInfo.email,
        chapter: chapter.chapterSequence,
        todoSequence: todoSequence,
        lectureId: lectureId,
        roomId: roomId,
      };

      if (currentTodo.type === "NORMAL") {
        sendTodoCheck(stompClient, sendData);
        setTodoSequence((prev) => (prev !== null ? prev + 1 : 0));
      } else if (currentTodo.type === "TIMER" && isTimerRunning) {
        // 타이머 기반 할 일은 강사가 타이머를 실행했을 때만 체크 가능
        sendTodoCheck(stompClient, sendData);
        setTodoSequence((prev) => (prev !== null ? prev + 1 : 0));
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
    isTimerRunning,
    sendTodoCheck,
    setTodoSequence,
  ]);
};
