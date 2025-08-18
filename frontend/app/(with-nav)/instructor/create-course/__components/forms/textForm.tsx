// __components/forms/textForm.tsx
"use client";

import { Input } from "antd";
import React from "react";

type Props = {
  /** 제어 값 */
  value: string;
  /** 값 변경 핸들러 */
  onChange?: (val: string) => void; // Made optional

  /** UI 옵션 */
  label?: string;
  placeholder?: string;
  maxLength?: number;
  allowClear?: boolean;
  size?: "small" | "middle" | "large";
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  type?: string; // Added type prop

  /** 상태/에러 표시 */
  error?: string | string[] | null;
  status?: "" | "error" | "warning";

  /** 부가 요소 */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

export default function TextForm({
  value,
  onChange, // onChange is now optional
  label,
  placeholder,
  maxLength,
  allowClear = true,
  size = "middle",
  disabled = false,
  required = false,
  readOnly,
  type, // Destructure type prop
  error = null,
  status,
  prefix,
  suffix,
}: Props) {
  const errMsg =
    error == null
      ? ""
      : Array.isArray(error)
        ? error.filter(Boolean).join("\n")
        : String(error);

  // status 우선순위: 명시된 status > 에러 존재 시 "error" > 기본 ""
  const computedStatus = status ?? (errMsg ? "error" : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && (
        <label style={{ fontWeight: 600 }}>
          {label}
          {required && (
            <span style={{ color: "crimson", marginLeft: 4 }}>*</span>
          )}
        </label>
      )}

      <Input
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined} // Conditionally pass onChange
        placeholder={placeholder}
        maxLength={maxLength}
        allowClear={allowClear}
        size={size}
        status={computedStatus}
        showCount={!!maxLength}
        disabled={disabled}
        readOnly={readOnly}
        type={type} // Pass type prop to Input element
        prefix={prefix}
        suffix={suffix}
      />

      {errMsg && (
        <div style={{ color: "crimson", whiteSpace: "pre-line", fontSize: 12 }}>
          {errMsg}
        </div>
      )}
    </div>
  );
}
