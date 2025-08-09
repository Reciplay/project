// "use client"

// import { SessionProvider } from "next-auth/react"

// export default function SessionProviderWrapper({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return <SessionProvider>{children}</SessionProvider>
// }
"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  session?: Session | null; // 서버에서 받은 초기 세션
};

export default function SessionProviderWrapper({ children, session }: Props) {
  return (
    <SessionProvider
      session={session}
      // v4 옵션
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
      // v5 사용 시(가능하다면) 추가:
      // staleTime={Infinity}
    >
      {children}
    </SessionProvider>
  );
}
