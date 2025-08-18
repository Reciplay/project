"use client";

import { useWhisperStt } from "@/hooks/live/features/useWhisperStt";
import { useChatbotStore } from "@/stores/chatBotStore";
import { usePorcupine } from "@picovoice/porcupine-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styles from "./chatBot.module.scss";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [isSttActive, setIsSttActive] = useState(false);

  const { messages, addMessage, clearMessages } = useChatbotStore();

  const { isRecording, startRecording } = useWhisperStt({
    onFinished: (transcript) => {
      setIsSttActive(false); // STT 프로세스 종료 알림
      if (transcript) {
        setInput(transcript); // 인식된 텍스트를 입력창에 표시
        sendMessage(transcript); // 메시지 즉시 전송
      }
    },
  });

  const [isKeywordListening, setIsKeywordListening] = useState(true);
  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();

  const processedKeywordDetectionRef = useRef(keywordDetection);

  useEffect(() => {
    if (
      keywordDetection !== null &&
      keywordDetection !== processedKeywordDetectionRef.current &&
      isKeywordListening
    ) {
      processedKeywordDetectionRef.current = keywordDetection;
      const detectedLabel = keywordDetection?.label ?? String(keywordDetection);
      console.log(
        `Wake word "${detectedLabel}" detected! Starting chatbot STT...`,
      );
      setIsSttActive(true);
      setIsKeywordListening(false);
    }
  }, [keywordDetection, isKeywordListening]);

  useEffect(() => {
    const initPorcupine = async () => {
      const accessKey =
        "I3NOG+N7ncUe6ibfyJZTWLyoHb/2oKwqGpy642LiMW4qyEjsY97bXw==";
      const keyword = {
        publicPath: "/porcupine/model.ppn",
        label: "하이 레시",
      };
      const model = {
        publicPath: "/porcupine/porcupine_params_ko.pv",
      };

      try {
        await init(accessKey, keyword, model);
        console.log("porcupine initiated...");
      } catch (err) {
        console.error("Failed to initialize Porcupine:", err);
      }
    };

    initPorcupine();

    return () => {
      release();
    };
  }, [init, release]);

  useEffect(() => {
    if (error) {
      console.error("Porcupine error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (isSttActive === false && !isKeywordListening) {
      console.log("Re-enabling keyword detection as chatbot is closed.");
      setIsKeywordListening(true);
    }
  }, [isSttActive, isKeywordListening]);

  useEffect(() => {
    const controlListening = async () => {
      if (isLoaded) {
        if (isKeywordListening && !isListening) {
          try {
            await start();
          } catch (err) {
            console.error("Failed to start Porcupine:", err);
          }
        } else if (!isKeywordListening && isListening) {
          try {
            await stop();
          } catch (err) {
            console.error("Failed to stop Porcupine:", err);
          }
        }
      }
    };
    controlListening();
  }, [isLoaded, isListening, start, stop, isKeywordListening]);

  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, []);

  useEffect(() => {
    if (isSttActive) {
      setInput("");
      startRecording();
    }
  }, [isSttActive]);

  const session = useSession();
  useEffect(() => {
    if (session.data?.user?.email) {
      setEmail(session.data.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (!email) return;

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
  }, [addMessage, email]);

  const sendMessage = (messageToSend?: string) => {
    const message = messageToSend ?? input;
    if (message && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
      addMessage(`You: ${message}`);

      setInput("");
    }
  };

  useEffect(() => {
    console.log(isSttActive);
  }, [isSttActive]);

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
