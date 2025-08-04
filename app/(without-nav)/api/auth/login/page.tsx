"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./page.module.scss";
import CustomInput from "@/components/input/customInput";
import BaseButton from "@/components/button/baseButton";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";
import { ROUTES } from "@/config/routes";
import AuthImage from "../__components/authImage/authImage";
import { formData } from "@/config/formData";

interface LoginForm {
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: "onSubmit" });

  const onSubmit = async (data: LoginForm) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(ROUTES.HOME);
    } else {
      alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <>
      <div className={styles.left}>
        <LogoWIthDesc desc="자유롭게 배우는 우리" />

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* email */}
          <CustomInput
            {...register("email", formData.email.rules)}
            placeholder={formData.email.placeholder}
            type={formData.email.type}
            error={errors.email?.message}
          />

          {/* password */}
          <CustomInput
            {...register("password", formData.password.rules)}
            placeholder={formData.password.placeholder}
            type={formData.password.type}
            error={errors.password?.message}
          />

          <BaseButton
            title="로그인"
            type="submit"
            size="inf"
            className={styles.button}
            // disabled={isSubmitting}
          />
        </form>

        <div className={styles.links}>
          <a href="#">아이디 찾기</a>
          <span> | </span>
          <a href="#">비밀번호 찾기</a>
          <span> | </span>
          <Link href={ROUTES.AUTH.SIGNUP}>회원가입</Link>
        </div>

        <Separator />
        <SNS props={{ isLogin: true }} />
      </div>

      {/* Right section */}
      <div className={styles.right}>
        <AuthImage />
      </div>
    </>
  );
}
