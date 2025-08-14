"use client";

import BaseButton from "@/components/button/baseButton";
import { useCreateCourse } from "@/hooks/instructor/useCreateCourse";
import type { LectureDTO } from "@/types/lecture";
import CanLearnsForm from "./__components/forms/canLearnsForm";
import CategoryForm from "./__components/forms/categoryForm";
import LectureForm from "./__components/forms/lectureForm";
import LectureList from "./__components/forms/lectureList";
import NumberForm from "./__components/forms/numberForm";
import Summary from "./__components/forms/summary";
import TextAreaForm from "./__components/forms/textAreaForm";
import TextForm from "./__components/forms/textForm";
import ThumbNailForm from "./__components/forms/thumbnailForm";
import styles from "./page.module.scss";

export default function Page() {
  const {
    requestCourseInfo,
    setCourseField,
    thumbnailImages,
    setThumbnailImages,
    courseCoverImage,
    setCourseCoverImage,
    lectures,
    setLectures,
    submitting,
    onSubmit,
  } = useCreateCourse();

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.content}>
        {/* 썸네일 */}
        <ThumbNailForm
          thumbnails={thumbnailImages}
          cover={courseCoverImage}
          onChangeThumbnails={setThumbnailImages}
          onChangeCover={setCourseCoverImage}
        />

        <div className={styles.title}>세부 설정</div>
        <div className={styles.line} />

        {/* 강좌명 */}
        <TextForm
          label="강좌명"
          placeholder="예: 실전 타입스크립트 마스터"
          value={requestCourseInfo.title}
          onChange={(v) => setCourseField("title", v)}
          maxLength={80}
          required
        />

        {/* 카테고리 */}
        <CategoryForm
          value={requestCourseInfo.categoryId}
          onChange={(v) => setCourseField("categoryId", v ?? 0)}
        />

        {/* 강좌소개 */}
        <TextAreaForm
          value={requestCourseInfo.description}
          onChange={(v) => setCourseField("description", v)}
        />

        {/* 강좌요약 버튼 */}
        <Summary />

        {/* 강좌요약 */}
        <TextForm
          label="강좌 요약"
          placeholder="강좌 핵심을 한 줄로 요약하세요."
          value={requestCourseInfo.summary}
          onChange={(v) => setCourseField("summary", v)}
          maxLength={120}
        />

        {/* 공지사항 */}
        <TextAreaForm
          label="공지사항"
          value={requestCourseInfo.announcement}
          onChange={(v) => setCourseField("announcement", v)}
          placeholder="수강 전 유의사항 등을 적어주세요."
          maxLength={1000}
        />

        {/* 모집인원 */}
        <NumberForm
          label="모집 인원"
          value={requestCourseInfo.maxEnrollments}
          onChange={(v) => setCourseField("maxEnrollments", v ?? 0)}
          min={0}
          step={1}
        />

        {/* 난이도 */}
        <NumberForm
          label="난이도"
          value={requestCourseInfo.level}
          onChange={(v) => setCourseField("level", v ?? 0)}
          min={0}
          max={5}
          step={1}
        />

        <div className={styles.middle}>
          이런걸 배울 수 있어요를 키워드 형식으로 작성해주세요
        </div>

        {/* 이런걸 배울 수 있어요 */}
        <CanLearnsForm
          label="이런 걸 배울 수 있어요"
          value={requestCourseInfo.canLearns}
          onChange={(next) => setCourseField("canLearns", next)}
        />

        {/* 강의 폼 (Draft→DTO 변환은 LectureForm 내부에서 처리) */}
        <LectureForm
          nextSequence={lectures.length}
          onAdd={(lecture: LectureDTO) =>
            setLectures((prev) => [...prev, lecture])
          }
        />

        {/* 강의 리스트 */}
        <LectureList
          value={lectures}
          onChange={(next: LectureDTO[]) => setLectures(next)}
        />

        {/* 제출 */}
        <BaseButton
          type="submit"
          title={submitting ? "등록 중..." : "강좌 등록 요청하기"}
          size="lg"
          variant="custom"
        />
      </div>
    </form>
  );
}
