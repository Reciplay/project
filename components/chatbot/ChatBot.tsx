"use client";

import { useWhisperStt } from "@/hooks/live/features/useWhisperStt";
import { useChatbotStore } from "@/stores/chatBotStore";
import { useEffect, useRef, useState } from "react";
import styles from "./chatBot.module.scss";
import { useSession } from "next-auth/react";

interface ChatBotProps {
  isSttActive: boolean;
  onSttFinished: () => void;
}

export default function ChatBot({ isSttActive, onSttFinished }: ChatBotProps) {
  const { messages, addMessage } = useChatbotStore();
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const [email, setEmail] = useState<string | undefined>(undefined);

  const { isRecording, startRecording } = useWhisperStt({
    onFinished: (transcript) => {
      onSttFinished(); // STT 프로세스 종료 알림
      if (transcript) {
        setInput(transcript); // 인식된 텍스트를 입력창에 표시
        sendMessage(transcript); // 메시지 즉시 전송
      }
    },
  });

  useEffect(() => {
    if (isSttActive) {
      setInput("");
      startRecording();
    }
  }, [isSttActive, startRecording]);

  const session = useSession();
  useEffect(() => {
    if (session.status) {
      const sessionMail = session.data?.user.email!;
      setEmail(sessionMail);
    }
  }, [session]);

  useEffect(() => {
    const host = "wss://i13e104.p.ssafy.io";
    const url = `${host}/chat/${encodeURIComponent(email!)}`;

    const ws = new WebSocket(url);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => addMessage(event.data);
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (e) => console.error("WebSocket error", e);

    ws.addEventListener("close", (e) => {
      console.log("WS close", e.code, e.reason);
    });
    socketRef.current = ws;
    return () => ws.close();
  }, [addMessage]);

  const sendMessage = (messageToSend?: string) => {
    const message = messageToSend ?? input;
    if (message && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
      addMessage(`You: ${message}`);

      setInput("");
    }
  };

  return (
    <div className={styles.chatbot}>
      <div className={styles.chatbot__messages}>
        {messages.map((m, i) => {
          const isUser = m.startsWith("You:");
          return (
            <div
              key={i}
              className={`${styles.chatbot__message} ${
                isUser
                  ? styles["chatbot__message--user"]
                  : styles["chatbot__message--bot"]
              }`}
            >
              {isUser ? (
                <>
                  <div className={styles.chatbot__bubble}>{m}</div>
                  <div className={styles.chatbot__avatar}>🙂</div>
                </>
              ) : (
                <>
                  <div className={styles.chatbot__avatar}>🤖</div>
                  <div className={styles.chatbot__bubble}>{m}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.chatbot__inputbar}>
        <input
          className={styles.chatbot__input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isRecording
              ? "듣고 있어요..."
              : "레시피에서 궁금한 점을 물어보세요!"
          }
          disabled={isRecording}
        />
        <button className={styles.chatbot__send} onClick={() => sendMessage()}>
          보내기
        </button>
      </div>
    </div>
  );
}
