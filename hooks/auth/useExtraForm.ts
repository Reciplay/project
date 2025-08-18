"use client";

import useAuth from "@/hooks/auth/useAuth";
import type { Gender, UserExtra } from "@/types/user";
import dayjs from "dayjs";
import { useState } from "react";

export interface ExtraValues {
  name: string;
  job: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender | null; // 필수이지만 선택 전엔 null
}

export interface ExtraErrors {
  name?: string;
  job?: string;
  birthDate?: string;
  gender?: string;
}

function validate(values: ExtraValues): ExtraErrors {
  const errors: ExtraErrors = {};

  if (!values.name.trim()) errors.name = "이름은 필수 입력 항목입니다.";
  if (!values.job.trim()) errors.job = "직업은 필수 입력 항목입니다.";

  if (!values.birthDate) {
    errors.birthDate = "생년월일은 필수입니다.";
  } else {
    const ok =
      /^\d{4}-\d{2}-\d{2}$/.test(values.birthDate) &&
      dayjs(values.birthDate, "YYYY-MM-DD", true).isValid() &&
      !dayjs(values.birthDate).isAfter(dayjs(), "day");
    if (!ok) errors.birthDate = "YYYY-MM-DD 형식이며 미래일 수 없습니다.";
  }

  if (values.gender !== 0 && values.gender !== 1) {
    errors.gender = "성별을 선택해주세요.";
  }

  return errors;
}

export default function useExtraForm(initial?: Partial<ExtraValues>) {
  const { submitExtra } = useAuth();

  const [values, setValues] = useState<ExtraValues>({
    name: "",
    job: "",
    birthDate: "",
    gender: null,
    ...initial,
  });

  const [errors, setErrors] = useState<ExtraErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof ExtraValues>(
    key: K,
    val: ExtraValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    // 필드 입력 시 해당 에러 즉시 해제
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;

    // 🔒 런타임 가드: gender가 null일 경우 방어 (이 경우 위 validate에서 이미 에러로 걸리지만, TS를 위해 한 번 더 보장)
    if (values.gender === null) {
      setErrors((prev) => ({ ...prev, gender: "성별을 선택해주세요." }));
      return;
    }

    // ✅ 여기부터는 gender가 non-null임이 런타임/타입 양쪽에서 보장되도록 payload를 UserExtra로 구성
    const payload: UserExtra = {
      name: values.name.trim(),
      job: values.job.trim(),
      birthDate: values.birthDate, // 이미 YYYY-MM-DD 형식 검증됨
      gender: values.gender as Gender, // validate + 가드 이후이므로 안전
    };

    try {
      setSubmitting(true);
      await submitExtra(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !!values.name &&
    !!values.job &&
    !!values.birthDate &&
    (values.gender === 0 || values.gender === 1) &&
    Object.values(errors).every((e) => !e);

  return {
    values,
    errors,
    submitting,
    canSubmit,
    setField,
    handleSubmit,
  };
}
