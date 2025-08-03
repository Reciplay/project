"use client";

import type { CreateCourseRequest } from "@/types/course";
import TextArea from "antd/es/input/TextArea";
import { Controller, useFormContext } from "react-hook-form";

// CreateCourseRequest 중 string 타입 키만 뽑아내는 유틸
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface TextAreaFormProps {
  name: StringKeys<CreateCourseRequest>;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export default function TextAreaForm({
  name,
  placeholder,
  rows = 4,
  maxLength = 6,
}: TextAreaFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateCourseRequest>();

  return (
    <div style={{ marginBottom: 12 }}>
      <Controller
        name={name}
        control={control}
        rules={{ required: placeholder }}
        render={({ field }) => (
          <TextArea
            {...field}
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            status={errors[name] ? "error" : ""}
          />
        )}
      />
      {errors[name] && (
        <p style={{ color: "red" }}>{errors[name]?.message as string}</p>
      )}
    </div>
  );
}
