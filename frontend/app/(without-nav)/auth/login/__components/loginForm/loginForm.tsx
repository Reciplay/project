"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import CustomInput from "@/components/input/customInput";
import CustomModal from "@/components/modal/customModal";
import { formData } from "@/config/formData";
import useAuth from "@/hooks/auth/useAuth";

import CustomButton from "@/components/button/customButton";
import { ROUTES } from "@/config/routes";
import Link from "next/link";
import styles from "../../page.module.scss";

export interface LoginFormValues {
  email: string;
  password: string;
}

type ModalType = "email" | "password" | null;

const FindEmailModal = dynamic(() => import("../findModal/findEmailModal"), {
  ssr: false,
});
const FindPasswordModal = dynamic(
  () => import("../findModal/findPasswordModal"),
  {
    ssr: false,
  },
);

export default function LoginForm() {
  const { login } = useAuth();
  const [modalType, setModalType] = useState<ModalType>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ mode: "onSubmit" });

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      await login(data);
    },
    [login],
  );

  const openEmail = useCallback(() => setModalType("email"), []);
  const openPassword = useCallback(() => setModalType("password"), []);
  const closeModal = useCallback(() => setModalType(null), []);

  const modalContent = useMemo(() => {
    if (modalType === "email") return <FindEmailModal />;
    if (modalType === "password") return <FindPasswordModal />;
    return null;
  }, [modalType]);

  return (
    <>
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
          autoComplete="email"
          aria-invalid={!!errors.email}
        />

        {/* password */}
        <CustomInput
          {...register("password", formData.password.rules)}
          placeholder={formData.password.placeholder}
          type={formData.password.type}
          error={errors.password?.message}
          autoComplete="current-password"
          aria-invalid={!!errors.password}
        />
        <CustomButton
          title={isSubmitting ? "로그인 중..." : "로그인"}
          type="submit"
          size="inf"
        />
      </form>

      <div className={styles.links}>
        <CustomButton title="아이디 찾기" onClick={openEmail} variant="link" />
        <CustomButton
          title="비밀번호 찾기"
          onClick={openPassword}
          variant="link"
        />
        <Link href={ROUTES.AUTH.SIGNUP}>회원가입</Link>
      </div>

      {modalType && (
        <CustomModal isOpen onClose={closeModal}>
          {modalContent}
        </CustomModal>
      )}
    </>
  );
}
