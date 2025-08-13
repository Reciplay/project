"use client";

import { LectureDTO } from "@/types/lecture";
import { Button, List, Tag } from "antd";
import dayjs from "dayjs";

type Props = {
  /** 강의 배열(제어형) */
  value: LectureDTO[];
  /** 배열 자체 교체가 필요할 때 (정렬 등) */
  onChange?: (next: LectureDTO[]) => void;
  /** 삭제 콜백(권장) — 없으면 onChange로 대체 */
  onRemove?: (index: number) => void;
};

export default function LectureList({ value, onChange, onRemove }: Props) {
  const removeAt = (idx: number) => {
    if (onRemove) return onRemove(idx);
    if (onChange) {
      const next = value
        .filter((_, i) => i !== idx)
        .map((lec, i) => ({
          ...lec,
          sequence: i, // 삭제 후 시퀀스 재정렬
        }));
      onChange(next);
    }
  };

  if (!value || value.length === 0) {
    return <p>등록된 강의가 없습니다.</p>;
  }

  return (
    <List
      bordered
      dataSource={value}
      renderItem={(lecture, index) => {
        const start = lecture.startedAt
          ? dayjs(lecture.startedAt).format("YYYY-MM-DD HH:mm")
          : "-";
        const end = lecture.endedAt
          ? dayjs(lecture.endedAt).format("YYYY-MM-DD HH:mm")
          : "-";
        const hasFile = !!lecture.localMaterialFile;

        return (
          <List.Item
            actions={[
              <Button
                type="link"
                danger
                onClick={() => removeAt(index)}
                key="delete"
              >
                삭제
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{index + 1}.</span>
                  <strong>{lecture.title || "제목 없음"}</strong>
                  {hasFile && <Tag>자료첨부</Tag>}
                </div>
              }
              description={
                <div>
                  <div style={{ color: "#666", marginBottom: 4 }}>
                    {start} ~ {end}
                  </div>
                  <div style={{ whiteSpace: "pre-line" }}>
                    {lecture.summary || "설명 없음"}
                  </div>
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
}
