"use client";

import styles from "./page.module.css";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      123
      {/* <h1>로그인</h1>
      <button onClick={() => signIn("github")}>GitHub로 로그인</button> */}
    </div>
  );
}
