"use client";

import { InputNumber } from "antd";
import { useCreateCourseStore } from "@/hooks/course/useCreateCourseStore";

type Name =
  | "requestCourseInfo.maxEnrollments"
  | "requestCourseInfo.level";

interface NumberFormProps {
  name: Name;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function NumberForm({
  name,
  placeholder,
  min,
  max,
  step,
}: NumberFormProps) {
  const value = useCreateCourseStore((s) => {
    const info = s.values.requestCourseInfo;
    return name === "requestCourseInfo.maxEnrollments"
      ? info.maxEnrollments
      : info.level;
  });
  const error = useCreateCourseStore((s) => s.errors[name]);
  const setField = useCreateCourseStore((s) => s.setField);

  return (
    <div style={{ marginBottom: 12 }}>
      <InputNumber
        value={typeof value === "number" ? value : undefined}
        onChange={(v) => {
          // antd InputNumber: v는 number | null
          const n = typeof v === "number" ? v : 0;
          setField(name, n);
        }}
        placeholder={placeholder}
        style={{ width: "100%" }}
        min={min}
        max={max}
        step={step}
        status={error ? "error" : ""}
      />
      {error && (
        <p style={{ color: "red", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
