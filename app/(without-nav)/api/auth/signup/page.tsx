'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import BaseButton from "@/components/button/baseButton";
import BaseInput from "@/components/input/baseInput";

import React, { useState } from 'react'

import restClient from "@/lib/axios/restClient";

export default function Page() {
  const [localError, setLocalError] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!nickname || nickname.length < 5 || nickname.length > 10) {
      alert('닉네임은 5자 이상 10자 이하여야 합니다.')
      return
    }
    
    if (!/^[a-zA-Z0-9가-힣]+$/.test(nickname)) {
      alert('닉네임은 한글, 숫자, 영어로만 이루어져야 합니다.')
      return
    }

    if (email.length < 5 || email.length > 30) {
      alert('이메일은 5자 이상 30자 이하여야 합니다.')
      return
    }

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      alert('유효한 이메일 주소를 입력하세요.')
      return
    }

    if (!password || password.length <8 || password.length > 20) {
      alert('비밀번호는 8자 이상 20자 이하여야 합니다.')
      return
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]).+$/.test(password)) {
      alert('비밀번호에는 영어, 숫자, 특수문자가 1자 이상 포함되어야 합니다.')
      return
    }

    if (password !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 다릅니다.')
      return
    }

    const res = await restClient.post('/signup', {nickname : nickname, email : email, password : password })
    if (res.status !== 201) {
      alert('회원가입 중 오류가 발생했습니다.')
    }
    else {
      alert('회원가입 성공!')
      console.log(res.data)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* left */}
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/auth-image.jpg"
              alt="Reciplay"
              fill
              className={styles.image}
            />
          </div>
        </div>
        {/* right */}
        <div className={styles.right}>
          <h1 className={styles.logo}>Reciplay</h1>
          <p className={styles.tagline}>
            지금 가입하고 자유로운 학습을 경험하세요!
          </p>

            <form className={styles.form} onSubmit={handleSignup}>
            <BaseInput
              placeholder="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname((e.target as HTMLInputElement).value)}
            />
            <BaseInput
              placeholder="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
            <BaseInput
              placeholder="인증번호"
              type="text"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail((e.target as HTMLInputElement).value)}
            />
            <BaseInput
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
            <BaseInput
              placeholder="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
            />

            <BaseButton title="다음" type="submit" />
            </form>
        </div>
      </div>
    </div>
  );
}
