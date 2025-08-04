"use client";

import Image from "next/image";
import styles from "./page.module.scss";

import BaseInput from "@/components/input/baseInput";
import BaseButton from "@/components/button/baseButton";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import restClient from "@/lib/axios/restClient";
import Inputs from "./__components/inputs/inputs";
import { ROUTES } from "@/config/routes";
import AuthImage from "../__components/authImage/authImage";

export interface SignupForm {
  nickname: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();

  const methods = useForm<SignupForm>({
    defaultValues: {
      nickname: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      alert("비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await restClient.post("/user/auth/signup", {
        nickname: data.nickname,
        email: data.email,
        password: data.password,
      });

      if (res.status === 201) {
        alert("회원가입 성공!");
        router.push(ROUTES.AUTH.LOGIN);
      } else {
        alert("회원가입 실패");
      }
    } catch (error) {
      alert("서버 오류 발생");
    }
  };

  return (
    <>
      <div className={styles.left}>
        <AuthImage />
      </div>

      <div className={styles.right}>
        <LogoWIthDesc desc="지금 가입하고 자유로운 학습을 경험하세요!" />

        <FormProvider {...methods}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <Inputs />
            <BaseButton
              title="회원가입"
              type="submit"
              size="inf"
              className={styles.button}
            />
          </form>
        </FormProvider>

        <Separator />
        <SNS props={{ isLogin: false }} />
      </div>
    </>
  );
}
