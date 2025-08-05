"use client"

import { useSession } from "next-auth/react"
import restClient from "@/lib/axios/restClient"
import { useState } from "react"
import ChatBot from '@/components/chatbot/ChatBot'


export default function TestPage() {
  
  const { data: session, status, update } = useSession()
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
    } catch (error) {
      if (error instanceof Error) {
        setApiResponse(`Error: ${error.message}`)
      } else {
        setApiResponse(`An unknown error occurred`)
      }
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Test Page</h1>

      <ChatBot/>

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
