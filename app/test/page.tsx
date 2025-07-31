"use client"

import { useSession } from "next-auth/react"
import restClient from "@/lib/axios/restClient"
import { useState, useRef, useEffect } from "react"
import { io, Socket } from "socket.io-client"

export default function TestPage() {
  // const [messages, setMessages] = useState<string[]>([])
  // const [input, setInput] = useState("")
  // const socketRef = useRef<Socket | null>(null)

  // useEffect(() => {
  //   // Connect to the socket server
  //   socketRef.current = io("ws://127.0.0.1:8000/ws")

  //   // Listen for "chat" events
  //   socketRef.current.on("chat", (msg: string) => {
  //     setMessages((prevMessages) => [...prevMessages, msg])
  //   })

  //   // Disconnect on component unmount
  //   return () => {
  //     socketRef.current?.disconnect()
  //   }
  // }, []) // Empty dependency array ensures this runs only once

  // const sendMessage = () => {
  //   if (input && socketRef.current) {
  //     socketRef.current.emit("chat", input)
  //     setInput("")
  //   }
  // }

  const { data: session, status, update } = useSession()
  const [apiResponse, setApiResponse] = useState("")

  const handleRefreshToken = async () => {
    if (!session?.refreshToken || !session?.accessToken) {
      setApiResponse("Refresh token or Access token is missing.")
      return
    }

    try {
      const response = await restClient.get(
        "/user/auth/refresh-token",
        {headers : {Cookie : `refreshToken=${session.refreshToken}`}}
      )

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

      {/* Chat Section */}
      {/* <div>
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
      </div> */}

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
