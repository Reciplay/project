"use client";

import CustomButton from "@/components/button/customButton";
import type { LectureDTO } from "@/types/lecture";
import { useState } from "react";
import TextAreaForm from "../../create-course/__components/forms/textAreaForm";
import TextForm from "../../create-course/__components/forms/textForm";
import styles from "./lectureEditForm.module.scss";

interface LectureEditFormProps {
  initialData: LectureDTO;
  onSave: (updatedLecture: LectureDTO) => void;
  onCancel: () => void;
}

export default function LectureEditForm({
  initialData,
  onSave,
  onCancel,
}: LectureEditFormProps) {
  const [formData, setFormData] = useState<LectureDTO>(initialData);

  // Fix 1: Use generic for handleChange to specify value type
  const handleChange = <K extends keyof LectureDTO>(
    field: K,
    value: LectureDTO[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className={styles.form}>
      <TextForm
        label="강의 제목"
        value={formData.title}
        onChange={(v) => handleChange("title", v)}
        maxLength={100}
        required
      />
      <TextAreaForm
        label="강의 요약"
        value={formData.summary}
        onChange={(v) => handleChange("summary", v)}
        maxLength={500}
      />
      <TextForm
        label="순서"
        type="number"
        value={String(formData.sequence)} // Fix 2: Convert number to string
        onChange={(v) => handleChange("sequence", Number(v))}
        required
      />
      <TextAreaForm
        label="자료"
        value={formData.materials}
        onChange={(v) => handleChange("materials", v)}
        maxLength={1000}
      />

      {/* Read-only date fields */}
      <TextForm
        label="시작 시간"
        value={new Date(formData.startedAt).toLocaleString()}
        readOnly
      />
      <TextForm
        label="종료 시간"
        value={new Date(formData.endedAt).toLocaleString()}
        readOnly
      />

      {/* TODO: Implement chapterList editing */}
      <div className={styles.chapterListPlaceholder}>
        챕터 목록 편집 (구현 예정)
      </div>

      <div className={styles.actions}>
        <CustomButton
          type="button"
          title="저장"
          size="md"
          variant="primary"
          onClick={handleSubmit}
        />
        <CustomButton
          type="button"
          title="취소"
          size="md"
          variant="secondary"
          onClick={onCancel}
        />
      </div>
    </div>
  );
}
