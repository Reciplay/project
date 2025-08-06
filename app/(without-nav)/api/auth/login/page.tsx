"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import { formData } from "@/config/formData";
import { ROUTES } from "@/config/routes";
import AuthImage from "../__components/authImage/authImage";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";
import styles from "./page.module.scss";
import useAuth from "@/hooks/auth/useAuth";

export interface LoginForm {
  email: string;
  password: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: "onSubmit" });

  const { login } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    await login(data);
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
