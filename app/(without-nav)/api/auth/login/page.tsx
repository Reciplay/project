'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";
import BaseInput from "@/components/input/baseInput";
import BaseButton from "@/components/button/baseButton";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email.length < 5 || email.length > 30) {
      alert('이메일은 5자 이상 30자 이하로 입력해주세요.')
      return
    }
    if (!password || password.length < 8 || password.length > 20) {
      alert('비밀번호는 8자 이상 20자 이하여야 합니다.')
      return
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/');
    } else {
      alert('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* left */}
        <div className={styles.left}>
          <h1 className={styles.logo}>Reciplay</h1>
          <p className={styles.tagline}>자유롭게 배우는 우리</p>

          <form className={styles.form} onSubmit={handleLogin}>
            <BaseInput placeholder="이메일" type="email" onChange={(e) => setEmail((e.target as HTMLInputElement).value)} />
            <BaseInput placeholder="비밀번호" type="password" onChange={(e) => setPassword((e.target as HTMLInputElement).value)} />

            <BaseButton title="로그인" type="submit"/>
          </form>

          <div className={styles.links}>
            <a href="#">아이디 찾기</a>
            <span> | </span>
            <a href="#">비밀번호 찾기</a>
            <span> | </span>
            <Link href="/api/auth/signup">회원가입</Link>
            {/* <a href="#">회원가입</a> */}
          </div>

          <div className={styles.separator}>
            <span className={styles.line} />
            <span className={styles.or}>or</span>
            <span className={styles.line} />
          </div>
          <p className={styles.tagline}>SNS 계정으로 간편 로그인</p>
          <div className={styles.snsIcons}>
            <a href="#">
              <Image
                src="/icons/apple.svg"
                alt="Apple"
                width={28}
                height={28}
              />
            </a>
            <a href="#">
              <Image
                src="/icons/google.svg"
                alt="Google"
                width={28}
                height={28}
              />
            </a>
            <a href="#">
              <Image
                src="/icons/kakao.svg"
                alt="Kakao"
                width={28}
                height={28}
              />
            </a>
          </div>
        </div>

        {/* right */}
        <div className={styles.right}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/auth-image.jpg"
              alt="Reciplay"
              fill
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
