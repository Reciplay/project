"use client";

import { useChatbotStore } from "@/stores/chatBotStore";
import { useEffect, useRef, useState } from "react";
import styles from "./chatBot.module.scss";

export default function ChatBot() {
  const { messages, addMessage } = useChatbotStore();
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const host = "wss://i13e104.p.ssafy.io";
    const email = "test@mail.com";
    const url = `${host}/chat/${encodeURIComponent(email)}`;

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

  const sendMessage = () => {
    if (input && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
      addMessage(`You: ${input}`);
      setInput("");
    }
  };

  return (
    <div className={styles.chatbot}>
      <div className={styles.chatbot__messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.chatbot__message} ${
              m.startsWith("You:")
                ? styles["chatbot__message--user"]
                : styles["chatbot__message--bot"]
            }`}
          >
            <div className={styles.chatbot__bubble}>{m}</div>
          </div>
        ))}
      </div>

      <div className={styles.chatbot__inputbar}>
        <input
          className={styles.chatbot__input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="레시피에서 궁금한 점을 물어보세요!"
        />
        <button className={styles.chatbot__send} onClick={sendMessage}>
          보내기
        </button>
      </div>
    </div>
  );
}
