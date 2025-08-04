"use client"

import { useSession } from "next-auth/react"
import restClient from "@/lib/axios/restClient"
import { useState, useRef, useEffect } from "react"



export default function TestPage() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const { data: session, status, update } = useSession()

  const setupWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      return
    }

    if (!session?.user?.email) {
      console.error("User not logged in. Cannot open chat.")
      setIsChatOpen(false)
      return
    }
    const email = session.user.email

    const ws = new WebSocket(`ws://localhost:8000/chat/${email}`)

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data])
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
    }

    socketRef.current = ws
  }

  const closeWebSocket = () => {
    socketRef.current?.close()
    socketRef.current = null
  }

  const toggleChat = () => {
    const newIsChatOpen = !isChatOpen
    setIsChatOpen(newIsChatOpen)

    if (newIsChatOpen) {
      setupWebSocket()
    } else {
      closeWebSocket()
      setMessages([]) // Clear messages when closing
    }
  }

  // Cleanup WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      socketRef.current?.close()
    }
  }, [])

  const sendMessage = () => {
    if (input && socketRef.current?.readyState === WebSocket.OPEN) {
      setMessages((prevMessages) => [...prevMessages, `You: ${input}`])
      socketRef.current.send(input)
      setInput("")
    }
  }

  
  const [apiResponse, setApiResponse] = useState("")

  const handleRefreshToken = async () => {
    if (!session?.refreshToken || !session?.accessToken) {
      setApiResponse("Refresh token or Access token is missing.")
      return
    }

    try {
      const response = await restClient.get("/user/auth/refresh-token", {
        headers: { Cookie: `refreshToken=${session.refreshToken}` },
      })

      const newAccessToken = response.headers.Authorization

      // Update the session with the new access token
      await update({
        ...session,
        accessToken: newAccessToken,
      })

      setApiResponse(JSON.stringify(response.data, null, 2))
    } catch (error: any) {
      setApiResponse(`Error: ${error.message}`)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Test Page</h1>

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

      <hr />

      {/* Session and Token Test Section */}
      <p>Current Session:</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button onClick={handleRefreshToken}>토큰 재갱신 테스트</button>
      {apiResponse && (
        <div>
          <h2>API 응답:</h2>
          <pre>{apiResponse}</pre>
        </div>
      )}
    </div>
  )
}