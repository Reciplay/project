"use client";

import BaseButton from "@/components/button/baseButton";
import CustomInput from "@/components/input/customInput";
import useAuth from "@/hooks/auth/useAuth";
import { FormProvider, useForm } from "react-hook-form";
import AuthImage from "../__components/authImage/authImage";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";
import styles from "./page.module.scss";

export interface UserExtra {
  name: string;
  job: string;
  birthDate: string;
  gender: number; // 0 = 남성, 1 = 여성
}

export default function ExtraPage() {
  const methods = useForm<UserExtra>({
    defaultValues: {
      name: "",
      job: "",
      birthDate: "",
      gender: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { submitExtra } = useAuth();

  return (
    <>
      <div className={styles.left}>
        <AuthImage />
      </div>

      <div className={styles.right}>
        <LogoWIthDesc desc="간단한 추가 정보만 입력하고 Reciplay를 시작하세요!" />

        <FormProvider {...methods}>
          <form className={styles.form} onSubmit={handleSubmit(submitExtra)}>
            <CustomInput
              placeholder="이름"
              type="text"
              {...register("name", {
                required: "이름은 필수 입력 항목입니다.",
              })}
              error={errors.name?.message}
            />

            <CustomInput
              placeholder="직업"
              type="text"
              {...register("job", { required: "직업은 필수 입력 항목입니다." })}
              error={errors.job?.message}
            />

            <CustomInput
              placeholder="생년월일 (예: 1990-01-01)"
              type="text"
              {...register("birthDate", {
                required: "생년월일은 필수입니다.",
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: "YYYY-MM-DD 형식으로 입력해주세요.",
                },
              })}
              error={errors.birthDate?.message}
            />

            <CustomInput
              placeholder="성별 (0: 남성, 1: 여성)"
              type="number"
              {...register("gender", {
                required: "성별은 필수입니다.",
                min: { value: 0, message: "0 또는 1을 입력하세요." },
                max: { value: 1, message: "0 또는 1을 입력하세요." },
              })}
              error={errors.gender?.message}
            />

            <BaseButton
              title="시작하기"
              type="submit"
              className={styles.button}
              size="inf"
            />
          </form>
        </FormProvider>
      </div>
    </>
  );
}
