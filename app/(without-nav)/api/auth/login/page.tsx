"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import CustomModal from "@/components/modal/customModal";
import { formData } from "@/config/formData";
import { ROUTES } from "@/config/routes";
import useAuth from "@/hooks/auth/useAuth";
import { useState } from "react";
import AuthImage from "../__components/authImage/authImage";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";
import FindEmailModal from "./__components/findEmailModal";
import FindPasswordModal from "./__components/findPasswordModal";
import styles from "./page.module.scss";

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
  const [modalType, setModalType] = useState<"email" | "password" | null>(null);

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
            // className={styles.button}
          />
        </form>

        <div className={styles.links}>
          <button onClick={() => setModalType("email")}>아이디 찾기</button>
          <span> | </span>
          <button onClick={() => setModalType("password")}>
            비밀번호 찾기
          </button>
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
      {modalType && (
        <CustomModal isOpen={true} onClose={() => setModalType(null)}>
          {modalType === "email" && <FindEmailModal />}
          {modalType === "password" && <FindPasswordModal />}
        </CustomModal>
      )}
    </>
  );
}
