"use client";

import CustomButton from "@/components/button/customButton";
import SegmentedToggle from "@/components/tab/segmentedToggle";
import VerticalTab from "@/components/tab/verticalTab";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseLectures } from "@/hooks/course/useCourseLectures";
import { useUpdateCourse } from "@/hooks/course/useUpdateCourse";
import { useUpdateLecture } from "@/hooks/course/useUpdateLecture"; // Import useUpdateLecture hook
import { useInstructorManageCourses } from "@/hooks/instructor/useInstructorMangeCourses";
import type { CourseManage } from "@/types/course";
import { useEffect, useState } from "react";
import CanLearnsForm from "../create-course/__components/forms/canLearnsForm";
import CategoryForm from "../create-course/__components/forms/categoryForm";
import NumberForm from "../create-course/__components/forms/numberForm";
import Summary from "../create-course/__components/forms/summary";
import TextAreaForm from "../create-course/__components/forms/textAreaForm";
import TextForm from "../create-course/__components/forms/textForm";
import ThumbNailForm from "../create-course/__components/forms/thumbnailForm";
import LectureAccordion from "./__components/lectureAccordion";
import styles from "./page.module.scss";

interface CourseDetailFormData {
  title: string;
  categoryId: number; // API returns string, but form needs number. Requires mapping.
  description: string;
  summary: string;
  announcement: string;
  maxEnrollments: number;
  level: number;
  canLearns: string[];
  enrollmentStartDate: string; // Added
  enrollmentEndDate: string; // Added
}

/** 우측 상세 패널: CourseManage 그대로 사용 */
function CoursePanelDetail({ courseId }: { courseId: number }) {
  const { course, loading, error } = useCourseDetail(courseId);
  const {
    lectures,
    loading: lecturesLoading,
    error: lecturesError,
    refetch: refetchLectures,
  } = useCourseLectures(courseId);

  const {
    updateCourse,
    loading: updateCourseLoading,
    error: updateCourseError,
  } = useUpdateCourse();
  const {
    updateLecture,
    loading: updateLectureLoading,
    error: updateLectureError,
  } = useUpdateLecture(); // Call useUpdateLecture

  const [formData, setFormData] = useState<CourseDetailFormData | null>(null);
  const [thumbnailImages, setThumbnailImages] = useState<(string | File)[]>([]);
  const [courseCoverImage, setCourseCoverImage] = useState<
    string | File | null
  >(null);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        // TODO: The API provides a category name (string), but the form component requires an ID (number).
        // A mapping from name to ID is needed here. Using a placeholder value for now.
        categoryId: 0,
        description: course.description,
        summary: course.summary,
        announcement: course.announcement,
        maxEnrollments: course.maxEnrollments,
        level: course.level,
        canLearns: course.canLearns,
        enrollmentStartDate: course.enrollmentStartDate,
        enrollmentEndDate: course.enrollmentEndDate,
      });
      // Extract just the URLs for initial display
      setThumbnailImages(
        course.thumbnailFileInfos?.map((f) => f.presignedUrl) || [],
      );
      setCourseCoverImage(course.courseCoverFileInfo?.presignedUrl || null);
    }
  }, [course]);

  const setCourseField = (field: keyof CourseDetailFormData, value) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const requestBody = {
        requestCourseInfo: {
          courseId: courseId,
          title: formData.title,
          enrollmentStartDate: formData.enrollmentStartDate,
          enrollmentEndDate: formData.enrollmentEndDate,
          categoryId: formData.categoryId,
          summary: formData.summary,
          maxEnrollments: formData.maxEnrollments,
          description: formData.description,
          level: formData.level,
          announcement: formData.announcement,
          canLearns: formData.canLearns,
        },
        thumbnailImages: thumbnailImages.filter(
          (img) => typeof img === "string",
        ) as string[],
        courseCoverImage:
          typeof courseCoverImage === "string" ? courseCoverImage : "",
      };

      await updateCourse(requestBody);
      alert("강좌 수정이 완료되었습니다.");
    } catch (err) {
      console.error("Update failed", err);
      alert(
        `강좌 수정 중 오류가 발생했습니다: ${updateCourseError || "알 수 없는 오류"}`,
      );
    }
  };

  if (loading) {
    return <div>강좌 상세 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!course || !formData) {
    return <div>강좌 상세 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <form className={styles.asd} onSubmit={onSubmit}>
      <div className={styles.content}>
        {/* 썸네일 */}
        <ThumbNailForm
          thumbnails={thumbnailImages}
          cover={courseCoverImage}
          onChangeThumbnails={(next) => setThumbnailImages(next)}
          onChangeCover={(next) => setCourseCoverImage(next)}
        />

        <div className={styles.title}>세부 설정</div>
        <div className={styles.line} />

        {/* 강좌명 */}
        <TextForm
          label="강좌명"
          placeholder="예: 실전 타입스크립트 마스터"
          value={formData.title}
          onChange={(v) => setCourseField("title", v)}
          maxLength={80}
          required
        />

        {/* 카테고리 */}
        <CategoryForm
          value={formData.categoryId}
          onChange={(v) => setCourseField("categoryId", v)}
        />

        {/* 강좌소개 */}
        <TextAreaForm
          value={formData.description}
          onChange={(v) => setCourseField("description", v)}
        />

        {/* 강좌요약 버튼 */}
        <Summary />

        {/* 강좌요약 */}
        <TextForm
          label="강좌 요약"
          placeholder="강좌 핵심을 한 줄로 요약하세요."
          value={formData.summary}
          onChange={(v) => setCourseField("summary", v)}
          maxLength={120}
        />

        {/* 공지사항 */}
        <TextAreaForm
          label="공지사항"
          value={formData.announcement}
          onChange={(v) => setCourseField("announcement", v)}
          placeholder="수강 전 유의사항 등을 적어주세요."
          maxLength={1000}
        />

        {/* 모집인원 */}
        <NumberForm
          label="모집 인원"
          value={formData.maxEnrollments}
          onChange={(v) => setCourseField("maxEnrollments", v ?? 0)}
          min={0}
          step={1}
        />

        {/* 난이도 */}
        <NumberForm
          label="난이도"
          value={formData.level}
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
          value={formData.canLearns}
          onChange={(next) => setCourseField("canLearns", next)}
        />

        <LectureAccordion
          lectures={lectures}
          loading={lecturesLoading}
          error={lecturesError}
          courseId={courseId}
          updateLecture={updateLecture}
          refetchLectures={refetchLectures}
        />

        {/* 제출 */}
        <CustomButton
          type="submit"
          title={updateCourseLoading ? "수정 중..." : "강좌 수정하기"}
          size="lg"
          variant="custom"
          disabled={updateCourseLoading}
        />
      </div>
    </form>
  );
}

export default function Page() {
  // Backend 규약: ongoing=모집중, soon=예정, end=종료
  const ongoing = useInstructorManageCourses("ongoing");
  const soon = useInstructorManageCourses("soon");
  const ended = useInstructorManageCourses("end");

  const getKey = (i: CourseManage) => String(i.courseId);
  const getLabel = (i: CourseManage) => i.title;
  const renderContent = (item: CourseManage) => (
    <CoursePanelDetail courseId={item.courseId} />
  );

  return (
    <div className={styles.container}>
      <SegmentedToggle
        options={["모집중", "예정", "종료"]}
        contents={[
          <VerticalTab
            key="ongoing"
            data={ongoing.list}
            loading={ongoing.loading}
            error={ongoing.error}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
          />,
          <VerticalTab
            key="soon"
            data={soon.list}
            loading={soon.loading}
            error={soon.error}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
          />,
          <VerticalTab
            key="end"
            data={ended.list}
            loading={ended.loading}
            error={ended.error}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
          />,
        ]}
      />
    </div>
  );
}
