"use client";

import { Radio } from "antd";
import styles from "./categoryForm.module.scss";

export type Category = { id: number; name: string };

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "한식" },
  { id: 2, name: "중식" },
  { id: 3, name: "일식" },
  { id: 4, name: "양식" },
  { id: 5, name: "제과/제빵" },
  { id: 6, name: "기타" },
];

type Props = {
  /** 선택된 카테고리 id (없으면 undefined) */
  value?: number;
  /** 변경 콜백 */
  onChange: (val?: number) => void;

  /** UI 옵션 */
  label?: string;
  error?: string | string[] | null;
  /** 커스텀 카테고리 전달 가능. 미전달 시 DEFAULT_CATEGORIES 사용 */
  categories?: Category[];
  /** 비활성화 */
  disabled?: boolean;
};

export default function CategoryForm({
  value,
  onChange,
  label,
  error = null,
  categories = DEFAULT_CATEGORIES,
  disabled = false,
}: Props) {
  const errMsg =
    error == null
      ? ""
      : Array.isArray(error)
      ? error.filter(Boolean).join("\n")
      : String(error);

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div className={styles.title}>{label}</div>}

      <Radio.Group
        value={value}
        onChange={(e) => {
          const nextVal = Number(e.target.value);
          // 같은 값 클릭 시 해제하고 싶다면 아래 주석 해제
          // if (value === nextVal) return onChange(undefined);
          onChange(Number.isNaN(nextVal) ? undefined : nextVal);
        }}
        style={{ marginTop: 8 }}
        disabled={disabled}
      >
        {categories.map((c) => (
          <Radio.Button key={c.id} value={c.id}>
            {c.name}
          </Radio.Button>
        ))}
      </Radio.Group>

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
