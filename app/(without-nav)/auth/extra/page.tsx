"use client";

import CustomButton from "@/components/button/customButton";
import CustomDatePicker from "@/components/calendar/customDatePicker";
import CustomInput from "@/components/input/customInput";
import GenderPicker from "@/components/radio/genderPicker";
import useExtraForm from "@/hooks/auth/useExtraForm";
import LogoWithDesc from "../../../../components/text/logoWithDesc/logoWithDesc";
import AuthImage from "../__components/authImage/authImage";
import styles from "./page.module.scss";

export default function ExtraPage() {
  const { values, errors, submitting, setField, handleSubmit } = useExtraForm();

  return (
    <>
      <div className={styles.left}>
        <AuthImage />
      </div>

      <div className={styles.right}>
        <LogoWithDesc desc="간단한 추가 정보만 입력하고 Reciplay를 시작하세요!" />

        {/* 완전 컨트롤드 폼 (RHF 없음) */}
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
        >
          {/* 이름 */}
          <CustomInput
            placeholder="이름"
            type="text"
            value={values.name}
            onChange={(e) => setField("name", e.currentTarget.value)}
            error={errors.name}
          />

          {/* 직업 */}
          <CustomInput
            placeholder="직업"
            type="text"
            value={values.job}
            onChange={(e) => setField("job", e.currentTarget.value)}
            error={errors.job}
          />

          {/* 생년월일 */}
          <CustomDatePicker
            value={values.birthDate}
            onChange={(val) => setField("birthDate", val)}
            placeholder="생년월일"
          />
          {errors.birthDate && (
            <p className={styles.error}>{errors.birthDate}</p>
          )}

          {/* 성별 */}
          <GenderPicker
            value={values.gender}
            onChange={(val) => setField("gender", val)}
          />
          {errors.gender && <p className={styles.error}>{errors.gender}</p>}

          <CustomButton
            title={submitting ? "처리 중..." : "시작하기"}
            type="submit"
            size="inf"
            // 필요하면 비활성화
            // className={styles.button}
          />
        </form>
      </div>
    </>
  );
}
