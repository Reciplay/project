"use client"

import { useSession, signIn } from "next-auth/react"
import restClient from "@/lib/axios/restClient"
import { useState } from "react"

export default function TestPage() {
  const { data: session, status, update } = useSession()
  const [apiResponse, setApiResponse] = useState("")

  const handleRefreshToken = async () => {
    if (!session?.refreshToken || !session?.accessToken) {
      setApiResponse("Refresh token or Access token is missing.")
      return
    }

    try {
      const response = await restClient.post(
        "/refresh-token", {}, {withCredentials : true}
      )

      const newAccessToken = response.data.accessToken
      
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
