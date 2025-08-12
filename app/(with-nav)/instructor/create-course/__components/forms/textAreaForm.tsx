"use client";

import { useCreateCourseStore } from "@/hooks/course/useCreateCourseStore";
import TextArea from "antd/es/input/TextArea";

type Name = "requestCourseInfo.description" | "requestCourseInfo.announcement";

interface BaseProps {
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  label?: string;
  onValueChange?: (v: string) => void;
}

type TextAreaFormProps =
  | (BaseProps & { name: Name }) // 스토어 바인딩 모드
  | (BaseProps & { name?: undefined }); // 독립(TextArea 단독) 모드

// 1) 훅 없는 독립 버전
function TextAreaStandalone({
  label,
  placeholder,
  rows = 4,
  maxLength = 2000,
  onValueChange,
}: BaseProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>}
      <TextArea
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onValueChange?.(e.target.value)}
      />
    </div>
  );
}

// 2) 훅 사용하는 바인딩 버전
function TextAreaBound({
  name,
  label,
  placeholder,
  rows = 4,
  maxLength = 2000,
  onValueChange,
}: BaseProps & { name: Name }) {
  const value = useCreateCourseStore((s) => {
    const info = s.values.requestCourseInfo;
    return name === "requestCourseInfo.description"
      ? info.description
      : info.announcement;
  });
  const error = useCreateCourseStore((s) => s.errors[name]);
  const setField = useCreateCourseStore((s) => s.setField);

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>}
      <TextArea
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          setField(name, v);
          onValueChange?.(v);
        }}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        status={error ? "error" : undefined}
      />
      {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// 3) 래퍼: 분기만 담당(훅 호출 X)
export default function TextAreaForm(props: TextAreaFormProps) {
  if (!("name" in props) || !props.name) {
    return <TextAreaStandalone {...props} />;
  }
  // name이 존재 → 바인딩 버전
  return <TextAreaBound {...(props as BaseProps & { name: Name })} />;
}
