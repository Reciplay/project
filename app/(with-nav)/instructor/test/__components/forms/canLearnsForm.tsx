"use client";

import { Select } from "antd";

type Props = {
  /** 현재 키워드들 */
  value: string[];
  /** 변경 콜백 */
  onChange: (next: string[]) => void;

  /** UI 옵션 */
  label?: string;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  disabled?: boolean;

  /** 검증/상태 */
  error?: string | string[] | null;
  status?: "" | "error" | "warning";

  /** 제한 옵션 */
  maxItems?: number; // 기본 10
  maxLenPerTag?: number; // 기본 30

  /** 구분자(엔터 외에) */
  tokenSeparators?: string[];
};

export default function CanLearnsForm({
  value,
  onChange,
  label,
  placeholder = "키워드를 입력하고 Enter 또는 , 로 구분",
  size = "middle",
  disabled = false,
  error = null,
  status,
  maxItems = 10,
  maxLenPerTag = 30,
  tokenSeparators = [",", " "],
}: Props) {
  const errMsg =
    error == null
      ? ""
      : Array.isArray(error)
      ? error.filter(Boolean).join("\n")
      : String(error);

  const computedStatus = status ?? (errMsg ? "error" : "");

  // 입력값 정리: trim, 길이 제한, 중복 제거, 개수 제한
  const sanitize = (arr: string[]) => {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const raw of arr) {
      const s = raw.trim();
      if (!s) continue;
      const cut = s.length > maxLenPerTag ? s.slice(0, maxLenPerTag) : s;
      if (!seen.has(cut)) {
        seen.add(cut);
        out.push(cut);
      }
      if (out.length >= maxItems) break;
    }
    return out;
  };

  return (
    <div style={{ width: "100%" }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>}

      <Select
        mode="tags"
        value={value ?? []}
        onChange={(vals) => onChange(sanitize((vals as string[]) || []))}
        tokenSeparators={tokenSeparators}
        placeholder={placeholder}
        style={{ width: "100%" }}
        maxTagCount="responsive"
        size={size}
        disabled={disabled}
        status={computedStatus}
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
