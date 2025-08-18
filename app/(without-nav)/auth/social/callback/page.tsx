// app/auth/social/callback/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SocialCallbackPage() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const email = sp.get("email") ?? "";
    const accessToken = sp.get("accessToken") ?? "";
    const refreshToken = sp.get("refreshToken") ?? "";
    const role = sp.get("role") ?? "";
    const requiredStr = sp.get("required") ?? "false";
    const required = requiredStr === "true";

    if (!email || !accessToken || !refreshToken) {
      router.replace("/auth/login/?error=social");
      return;
    }

    signIn("credentials", {
      redirect: false,
      tokenLogin: "1",
      email,
      accessToken,
      refreshToken,
      role,
      required: String(required), // NextAuth로 넘길 때 문자열로
    }).then((r) => {
      if (r?.error) router.replace("/auth/login/?error=CredentialsSignin");
      else router.replace("/");
    });
  }, [sp, router]);

  return null;
}
