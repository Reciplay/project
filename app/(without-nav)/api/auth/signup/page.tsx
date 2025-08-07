"use client";

import styles from "./page.module.scss";

import BaseButton from "@/components/button/baseButton";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";

import useSignUp from "@/hooks/auth/useSignUp";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import AuthImage from "../__components/authImage/authImage";
import Inputs from "./__components/inputs/inputs";

export interface SignupForm {
  nickname: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

export default function Page() {
  const methods = useForm<SignupForm>({
    defaultValues: {
      nickname: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <>
      <div className={styles.left}>
        <AuthImage />
      </div>

      <div className={styles.right}>
        <LogoWIthDesc desc="지금 가입하고 자유로운 학습을 경험하세요!" />

        <FormProvider {...methods}>
          <SignupFormContent />
        </FormProvider>

        <Separator />
        <SNS props={{ isLogin: false }} />
      </div>
    </>
  );
}

function SignupFormContent() {
  const { signup, handleVerifyCode } = useSignUp();
  const { handleSubmit } = useFormContext<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    const otp = await handleVerifyCode();
    if (!otp) {
      alert("이메일 인증키를 작성해주세요.");
      return;
    }

    await signup(data, otp);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Inputs />
      <BaseButton
        title="회원가입"
        type="submit"
        size="inf"
        className={styles.button}
      />
    </form>
  );
}
