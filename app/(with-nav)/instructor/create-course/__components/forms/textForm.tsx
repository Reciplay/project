// __components/forms/textForm.tsx
"use client";

import React from "react";
import { Input } from "antd";
import { useCreateCourseStore, type FieldKey } from "@/hooks/course/useCreateCourseStore";

type Props = {
  name: FieldKey;               // 예: "requestCourseInfo.summary"
  placeholder?: string;
  label?: string;
  maxLength?: number;
  allowClear?: boolean;
  size?: "small" | "middle" | "large";
};

export default function TextForm({
  name,
  placeholder,
  label,
  maxLength,
  allowClear = true,
  size = "middle",
}: Props) {
  const { values, errors, setField } = useCreateCourseStore();

  // dot-path getter
  const getByPath = (obj: any, path: string) =>
    path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);

  const value = (getByPath(values, name) ?? "") as string;

  const errMsg = (() => {
    const e = errors?.[name as keyof typeof errors];
    if (!e) return "";
    return Array.isArray(e) ? e.join("\n") : String(e);
  })();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <label style={{ fontWeight: 600 }}>{label}</label>}
      <Input
        value={value}
        onChange={(e) => setField(name, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        allowClear={allowClear}
        size={size}
        status={errMsg ? "error" : ""}
        showCount={!!maxLength}
      />
      {errMsg && (
        <div style={{ color: "crimson", whiteSpace: "pre-line", fontSize: 12 }}>
          {errMsg}
        </div>
      )}
    </div>
  );
}
