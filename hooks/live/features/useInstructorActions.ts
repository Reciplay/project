import { Dispatch, SetStateAction, useEffect } from "react";
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
        chapterSequence: chapter?.chapterSequence ?? 0, // 현재 챕터 시퀀스를 기반으로 다음 챕터 결정
      });
      setTodoSequence(0); // 새 챕터의 첫 할 일부터 시작
    }
  }, [
    recognizedPose,
    stompClient,
    roomInfo,
    roomId,
    lectureId,
    sendChapterIssue,
    chapter?.chapterSequence,
    setTodoSequence,
  ]);

  // 'Closed_Fist' 제스처 처리 -> 도움 요청 (강사도 도움 요청 가능)
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
        nickname: roomInfo.nickname, // 실제 닉네임 사용
        issuer: roomInfo.email,
        lectureId: lectureId,
        roomId: roomId,
      });
    }
  }, [handGesture, stompClient, roomInfo, roomId, lectureId, sendHelp]);

  // 'ThumbsUp' 제스처 처리 -> 할 일 체크 / 타이머 시작
  useEffect(() => {
    console.log("엄지척 훅 발동!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(stompClient);
    console.log(roomInfo?.email);
    console.log(roomId);
    console.log(chapter?.todos);

    if (
      handGesture === "Thumb_Up" &&
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
      } else if (currentTodo.type === "TIMER") {
        if (isTimerRunning) {
          sendTodoCheck(stompClient, sendData);
          setIsTimerRunning(false);
          setTodoSequence((prev) => (prev !== null ? prev + 1 : 0));
        } else {
          setIsTimerRunning(true);
          // 실제 타이머 로직은 페이지 컴포넌트나 별도 타이머 훅에서 관리합니다.
        }
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
    setIsTimerRunning,
    setTodoSequence,
  ]);
};
