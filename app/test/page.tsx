"use client";

import restClient from "@/lib/axios/restClient";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TestPage() {
  const { data: session, status, update } = useSession();
  const [apiResponse, setApiResponse] = useState("");

  const handleRefreshToken = async () => {
    if (!session?.refreshToken || !session?.accessToken) {
      setApiResponse("Refresh token or Access token is missing.");
      return;
    }

    try {
      const response = await restClient.get("/user/auth/refresh-token", {
        headers: { "refresh-token": session.refreshToken },
      });

      // const response = await axios.get("https://2913fcf0f9a2.ngrok-free.app/api/v1/user/auth/refresh-token", {
      //   headers : {'refresh-token' : session.refreshToken,
      // 'ngrok-skip-browser-warning' : true}
      // })

      const newAccessToken = response.headers.Authorization;

      await update({
        ...session,
        accessToken: newAccessToken,
      });

      setApiResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        setApiResponse(`Error: ${error.message}`);
      } else {
        setApiResponse(`An unknown error occurred`);
      }
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Test Page</h1>

      {/* <ChatBot /> */}

      <hr />

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
  );
}
