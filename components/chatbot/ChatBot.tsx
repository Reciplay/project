"use client";

import { useChatbotStore } from "@/stores/chatBotStore";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function ChatBot() {
  const { messages, addMessage, clearMessages } = useChatbotStore();
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { data: session } = useSession();

  const setupWebSocket = () => {
    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED
    ) {
      return;
    }

    if (!session?.user?.email) {
      console.error("User not logged in. Cannot open chat.");
      setIsChatOpen(false);
      return;
    }
    const email = session.user.email;

    const ws = new WebSocket(`ws://localhost:8000/chat/${email}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      addMessage(event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socketRef.current = ws;
  };

  const closeWebSocket = () => {
    socketRef.current?.close();
    socketRef.current = null;
  };

  const toggleChat = () => {
    const newIsChatOpen = !isChatOpen;
    setIsChatOpen(newIsChatOpen);

    if (newIsChatOpen) {
      setupWebSocket();
    } else {
      closeWebSocket();
      clearMessages(); // Clear messages when closing
    }
  };

  // Cleanup WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input && socketRef.current?.readyState === WebSocket.OPEN) {
      addMessage(`You: ${input}`);
      socketRef.current.send(input);
      setInput("");
    }
  };
  return (
    <div>
      <button onClick={toggleChat}>
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </button>
      {isChatOpen && (
        <div>
          <h2>Chat</h2>
          <div id="messages">
            {messages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
