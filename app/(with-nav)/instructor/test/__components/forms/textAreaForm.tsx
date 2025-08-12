"use client";

import TextArea from "antd/es/input/TextArea";

type Props = {
  /** 제어 값 */
  value: string;
  /** 값 변경 핸들러 */
  onChange: (v: string) => void;

  /** UI 옵션 */
  label?: string;
  placeholder?: string;
  rows?: number; // 기본 4
  maxLength?: number; // 기본 2000
  disabled?: boolean;
  autoSize?: { minRows?: number; maxRows?: number };

  /** 상태/에러 표시 */
  error?: string | string[] | null;
  status?: "" | "error" | "warning";
};

export default function TextAreaForm({
  value,
  onChange,
  label,
  placeholder,
  rows = 4,
  maxLength = 2000,
  disabled = false,
  autoSize,
  error = null,
  status,
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

      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        status={computedStatus}
        disabled={disabled}
        autoSize={autoSize}
        showCount={!!maxLength}
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
