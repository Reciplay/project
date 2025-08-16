// app/(auth)/auth/login/__components/sns/sns.tsx
"use client";

import { AUTH } from "@/config/const";
import Image from "next/image";
import styles from "./sns.module.scss";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
interface SNSProps {
  props: {
    isLogin: boolean;
  };
}

export default function SNS({ props }: SNSProps) {
  const startOAuth = (provider: "google" | "kakao" | "naver") => {
    // ✅ 스프링 시큐리티 OAuth 시작점으로 이동
    window.location.href = `${BACKEND}/oauth2/authorization/${provider}`;
  };

  const providers: Array<"google" | "kakao" | "naver"> = [
    "naver",
    "kakao",
    "google",
  ];

  const text = props.isLogin ? AUTH.LOGIN : AUTH.SIGNUP;

  return (
    <>
      <div className={styles.tagline}>
        {AUTH.SNS} {text}
      </div>

      <div className={styles.snsIcons}>
        {providers.map((p) => (
          <div
            key={p}
            onClick={() => startOAuth(p)}
            role="button"
            aria-label={`Sign in with ${p}`}
            className={styles.snsIconLink}
          >
            <Image src={`/icons/${p}.svg`} alt={p} width={28} height={28} />
          </div>
        ))}
      </div>
    </>
  );
}
