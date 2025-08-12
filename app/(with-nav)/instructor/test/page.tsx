"use client";

import BaseButton from "@/components/button/baseButton";
import { useCourseForm } from "@/hooks/test/useTestCourseForm";
import { useSubmitCourse } from "@/hooks/test/useTestSubmitCourse";
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
  const form = useCourseForm();
  const { submitting, submitAll } = useSubmitCourse();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault(); // ★ 네이티브 submit 막기
    console.log("[Page] submit clicked");

    const result = await submitAll({
      requestCourseInfo: form.getRequestCourseInfo(),
      imagesRaw: form.getImagesRaw(),
      lectures: form.getLectures(),
      onReset: form.reset,
    });

    console.log("[Page] submitAll result:", result);
    if (!result.success) {
      // 에러 메시지 노출
      alert(result.errorMessage ?? "등록 실패");
    }
  };

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.content}>
        {/* 썸네일 */}
        <ThumbNailForm
          thumbnails={form.thumbnailImages}
          cover={form.courseCoverImage}
          onChangeThumbnails={form.setThumbnailImages}
          onChangeCover={form.setCourseCoverImage}
        />

        <div className={styles.title}>세부 설정</div>
        <div className={styles.line} />

        {/* 강좌명 */}
        <TextForm
          label="강좌명"
          placeholder="예: 실전 타입스크립트 마스터"
          value={form.requestCourseInfo.title}
          onChange={(v) => form.setCourseField("title", v)}
          maxLength={80}
          required
        />

        {/* 카테고리 */}
        <CategoryForm
          value={form.requestCourseInfo.categoryId}
          onChange={(v) => form.setCourseField("categoryId", v)}
        />

        {/* 강좌소개 */}
        <TextAreaForm
          value={form.requestCourseInfo.description}
          onChange={(v) => form.setCourseField("description", v)}
        />

        {/* 강좌요약 버튼 */}
        <Summary />

        {/* 강좌요약 */}
        <TextForm
          label="강좌 요약"
          placeholder="강좌 핵심을 한 줄로 요약하세요."
          value={form.requestCourseInfo.summary}
          onChange={(v) => form.setCourseField("summary", v)}
          maxLength={120}
        />

        {/* 공지사항 */}
        <TextAreaForm
          label="공지사항"
          value={form.requestCourseInfo.announcement}
          onChange={(v) => form.setCourseField("announcement", v)}
          placeholder="수강 전 유의사항 등을 적어주세요."
          maxLength={1000}
        />

        {/* 모집인원 */}
        <NumberForm
          label="모집 인원"
          value={form.requestCourseInfo.maxEnrollments}
          onChange={(v) => form.setCourseField("maxEnrollments", v ?? 0)}
          min={0}
          step={1}
        />

        {/* 난이도 */}
        <NumberForm
          label="난이도"
          value={form.requestCourseInfo.level}
          onChange={(v) => form.setCourseField("level", v ?? 0)}
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
          value={form.requestCourseInfo.canLearns}
          onChange={(next) => form.setCourseField("canLearns", next)}
        />

        {/* 강의 폼: 단일 드래프트 → onAdd으로 목록에 추가 */}
        <LectureForm
          nextSequence={form.lectures.length}
          onAdd={(draft) => form.addLecture(draft)}
        />

        {/* 강의 리스트 */}
        <LectureList value={form.lectures} onChange={form.setLectures} />

        {/* 제출 */}
        <BaseButton
          type="submit"
          title={submitting ? "등록 중..." : "강좌 등록 요청하기"}
          size="lg"
          variant="custom"
          // disabled={submitting}
        />
      </div>
    </form>
  );
}
