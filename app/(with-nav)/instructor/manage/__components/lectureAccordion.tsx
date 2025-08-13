"use client";

import type { LectureDTO, LectureSummary } from "@/types/lecture";
import { useState } from "react";
import styles from "./lectureAccordion.module.scss";
import LectureEditForm from "./lectureEditForm"; // Import LectureEditForm

interface LectureAccordionItemProps {
  lecture: LectureSummary;
  courseId: number; // Added courseId
  updateLecture: (
    courseId: number,
    lectureData: { lecture: LectureDTO[] },
  ) => Promise<any>; // Function to update lecture
  refetchLectures: () => void; // Function to refetch lectures after update
}

const LectureAccordionItem = ({
  lecture,
  courseId,
  updateLecture,
  refetchLectures,
}: LectureAccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedLecture: LectureDTO) => {
    try {
      // The API expects an array of lectures, even for a single update
      await updateLecture(courseId, { lecture: [updatedLecture] });
      alert("강의가 성공적으로 수정되었습니다.");
      setIsEditing(false); // Exit edit mode
      refetchLectures(); // Refresh the list
    } catch (error) {
      console.error("Failed to update lecture:", error);
      alert("강의 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className={styles.item}>
      <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span>
          {lecture.sequence}. {lecture.title}
        </span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className={styles.content}>
          {isEditing ? (
            <LectureEditForm
              initialData={{
                title: lecture.title,
                summary: "", // Summary is not in LectureSummary, will be empty or fetched
                sequence: lecture.sequence,
                materials: "", // Materials not in LectureSummary
                startedAt: lecture.startedAt,
                endedAt: lecture.startedAt, // Assuming endedAt is same as startedAt for summary
                chapterList: [], // ChapterList not in LectureSummary
              }}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <p>
                <strong>강의 ID:</strong> {lecture.lectureId}
              </p>
              <p>
                <strong>시작 시간:</strong>{" "}
                {new Date(lecture.startedAt).toLocaleString()}
              </p>
              <p>
                <strong>녹화 건너뜀:</strong>{" "}
                {lecture.isSkipped ? "예" : "아니오"}
              </p>
              <div className={styles.actions}>
                <button onClick={() => setIsEditing(true)}>수정</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface LectureAccordionProps {
  lectures: LectureSummary[];
  loading: boolean;
  error: string | null;
  courseId: number; // Added courseId
  updateLecture: (
    courseId: number,
    lectureData: { lecture: LectureDTO[] },
  ) => Promise<any>; // Added updateLecture
  refetchLectures: () => void; // Added refetchLectures
}

export default function LectureAccordion({
  lectures,
  loading,
  error,
  courseId,
  updateLecture,
  refetchLectures,
}: LectureAccordionProps) {
  if (loading) {
    return <p>강의 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p>오류: {error}</p>;
  }

  if (!lectures || lectures.length === 0) {
    return <p>등록된 강의가 없습니다.</p>;
  }

  return (
    <div className={styles.accordion}>
      <div className={styles.listTitle}>강의 목록</div>
      {lectures.map((lecture) => (
        <LectureAccordionItem
          key={lecture.lectureId}
          lecture={lecture}
          courseId={courseId}
          updateLecture={updateLecture}
          refetchLectures={refetchLectures}
        />
      ))}
    </div>
  );
}
