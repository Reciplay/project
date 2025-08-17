// app/(auth)/auth/login/__components/sns/sns.tsx
"use client";

import Image from "next/image";
import styles from "./sns.module.scss";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export default function SNS({ props: { isLogin } }: { props: { isLogin: boolean } }) {
  const startOAuth = (provider: "google" | "kakao" | "naver") => {
    // ✅ 스프링 시큐리티 OAuth 시작점으로 이동
    window.location.href = `${BACKEND}/oauth2/authorization/${provider}`;
  };

  const providers: Array<"google" | "kakao" | "naver"> = ["naver", "kakao", "google"];

  return (
    <div className={styles.snsIcons}>
      {providers.map((p) => (
        <div key={p} onClick={() => startOAuth(p)} role="button" aria-label={`Sign in with ${p}`}>
          <Image src={`/icons/${p}.svg`} alt={p} width={28} height={28} />
        </div>
      ))}
    </div>
  );
}
