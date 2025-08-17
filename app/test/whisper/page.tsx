"use client";

import ChatBot from "@/components/chatbot/chatBot";
import { useState } from "react";

export default function WhisperTestPage() {
  const [isSttActive, setIsSttActive] = useState(false);

  const handleSttFinished = () => {
    setIsSttActive(false);
    console.log("STT finished");
  };

  const handleStartStt = () => {
    setIsSttActive(true);
  };

  return (
    <div>
      <h1>ChatBot STT 테스트</h1>
      <button onClick={handleStartStt} disabled={isSttActive}>
        음성으로 질문하기
      </button>
      <ChatBot isSttActive={isSttActive} onSttFinished={handleSttFinished} />
    </div>
  );
}
