// components/forms/NumberForm.tsx
"use client";
import type { CreateCourseRequest } from "@/types/course";
import { InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";

// CreateCourseRequest 중 number 타입 키만 뽑아내는 유틸
type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

interface NumberFormProps {
  name: NumberKeys<CreateCourseRequest>;
  placeholder?: string;
}

export default function NumberForm({ name, placeholder }: NumberFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateCourseRequest>();

  return (
    <div style={{ marginBottom: 12 }}>
      {/* <label>{label}</label> */}
      <Controller
        name={name}
        control={control}
        rules={{ required: placeholder }}
        render={({ field }) => (
          <InputNumber
            {...field}
            placeholder={placeholder}
            variant="underlined"
            style={{ width: 300 }}
          />
        )}
      />
      {errors[name] && (
        <p style={{ color: "red" }}>{errors[name]?.message as string}</p>
      )}
    </div>
  );
}
