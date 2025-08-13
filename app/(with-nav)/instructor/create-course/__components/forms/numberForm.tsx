"use client";

import { InputNumber } from "antd";

type Props = {
  /** 제어 값 (null이면 비움) */
  value: number | null | undefined;
  /** 값 변경 핸들러 */
  onChange: (v: number | null) => void;

  /** UI 옵션 */
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  size?: "small" | "middle" | "large";
  disabled?: boolean;

  /** 상태/에러 표시 */
  error?: string | string[] | null;
  status?: "" | "error" | "warning";

  /** 숫자 포맷/파서 (선택) */
  formatter?: (value?: string | number) => string;
  parser?: (value: string | undefined) => number;
};

export default function NumberForm({
  value,
  onChange,
  label,
  placeholder,
  min,
  max,
  step,
  size = "middle",
  disabled = false,
  error = null,
  status,
  formatter,
  parser,
}: Props) {
  const errMsg =
    error == null
      ? ""
      : Array.isArray(error)
        ? error.filter(Boolean).join("\n")
        : String(error);

  const computedStatus = status ?? (errMsg ? "error" : "");

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>}

      <InputNumber
        value={typeof value === "number" ? value : null}
        onChange={(v) => onChange(typeof v === "number" ? v : null)}
        placeholder={placeholder}
        style={{ width: "100%" }}
        min={min}
        max={max}
        step={step}
        size={size}
        disabled={disabled}
        status={computedStatus}
        formatter={formatter}
        parser={parser}
      />

      {errMsg && (
        <p
          style={{
            color: "crimson",
            marginTop: 4,
            whiteSpace: "pre-line",
            fontSize: 12,
          }}
        >
          {errMsg}
        </p>
      )}
    </div>
  );
}
