"use client";

import TextArea from "antd/es/input/TextArea";
import { useCreateCourseStore } from "@/hooks/course/useCreateCourseStore";

type Name =
  | "requestCourseInfo.description"
  | "requestCourseInfo.announcement";

interface BaseProps {
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  label?: string;
  onValueChange?: (v: string) => void;
}

type TextAreaFormProps =
  | (BaseProps & { name: Name })              // 스토어 바인딩 모드
  | (BaseProps & { name?: undefined });       // 독립(TextArea 단독) 모드

export default function TextAreaForm(props: TextAreaFormProps) {
  const rows = props.rows ?? 4;
  const maxLength = props.maxLength ?? 2000;

  // 독립 TextArea 모드 (name 미지정)
  if (!("name" in props) || !props.name) {
    const { label, placeholder, onValueChange } = props;
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

  // 스토어 바인딩 모드 (name 지정)
  const { name, label, placeholder, onValueChange } = props;

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
        status={error ? "error" : ""}
      />
      {error && (
        <p style={{ color: "red", marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
