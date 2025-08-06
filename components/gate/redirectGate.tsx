"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RedirectGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    // 세션이 있고, required가 true일 때 /api/auth/extra가 아니라면 리다이렉트
    // if (session?.required && pathname !== "/api/auth/extra") {
    //   router.replace("/api/auth/extra");
    // }
  }, [session, status, pathname]);

  return <>{children}</>;
}
