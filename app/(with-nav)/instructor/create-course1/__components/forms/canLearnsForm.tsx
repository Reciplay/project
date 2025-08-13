"use client";

import { useCreateCourseStore } from "@/hooks/course/useCreateCourseStore";
import { Select } from "antd";

type Name = "requestCourseInfo.canLearns";

interface CanLearnsFormProps {
  name?: Name; // 기본: "requestCourseInfo.canLearns"
  placeholder?: string;
  maxItems?: number; // 기본 10
  maxLenPerTag?: number; // 기본 30
}

export default function CanLearnsForm({
  name = "requestCourseInfo.canLearns",
  placeholder = "키워드를 입력하고 Enter 또는 , 로 구분",
  maxItems = 10,
  maxLenPerTag = 30,
}: CanLearnsFormProps) {
  const value = useCreateCourseStore(
    (s) => s.values.requestCourseInfo.canLearns,
  );
  const error = useCreateCourseStore((s) => s.errors[name]);
  const setField = useCreateCourseStore((s) => s.setField);

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
      <Select
        mode="tags"
        value={value ?? []}
        onChange={(vals) => setField(name, sanitize((vals as string[]) || []))}
        tokenSeparators={[",", " "]} // 쉼표/공백으로도 분리 입력
        placeholder={placeholder}
        style={{ width: "100%" }}
        maxTagCount="responsive"
        status={error ? "error" : ""}
      />
      {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}
    </div>
  );
}
