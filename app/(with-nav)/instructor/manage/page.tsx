"use client";

import SegmentedToggle from "@/components/tab/segmentedToggle";
import VerticalTab from "@/components/tab/verticalTab";
import { useInstructorManageCourses } from "@/hooks/instructor/useInstructorMangeCourses"; // 경로/철자 확인!
import type { CourseManage } from "@/types/course";

// ✅ CourseManage 더미(없으면 API 빈 결과 시 화면 비게 됨)
import BaseButton from "@/components/button/baseButton";
import {
  sampleCourse1,
  sampleCourse2,
  sampleCourse3,
} from "@/config/sampleCourse"; // 이 파일이 CourseManage[]를 내보내도록 보장
import CanLearnsForm from "../create-course/__components/forms/canLearnsForm";
import CategoryForm from "../create-course/__components/forms/categoryForm";
import LectureList from "../create-course/__components/forms/lectureList";
import NumberForm from "../create-course/__components/forms/numberForm";
import Summary from "../create-course/__components/forms/summary";
import TextAreaForm from "../create-course/__components/forms/textAreaForm";
import TextForm from "../create-course/__components/forms/textForm";
import ThumbNailForm from "../create-course/__components/forms/thumbnailForm";
import LectureForm from "../create-course/__components/lectureform/lectureForm";
import styles from "./page.module.scss";

/** 우측 상세 패널: CourseManage 그대로 사용 */
function CoursePanelDetail() {
  // const thumb =
  //   item.thumbnailFileInfos?.[0]?.presignedUrl ??
  //   item.courseCoverFileInfo?.presignedUrl ??
  //   "";

  return (
    <form className={styles.asd}>
      <div className={styles.content}>
        <ThumbNailForm
          thumbnailName="thumbnailImages"
          coverName="courseCoverImage"
        />

        <div className={styles.title}>세부 설정</div>
        <div className={styles.line} />

        {/* ⬇⬇ 반드시 중첩 경로로! */}
        <TextForm
          name="requestCourseInfo.title"
          placeholder="강좌명을 입력해주세요"
        />
        <CategoryForm name="requestCourseInfo.categoryId" label="카테고리" />
        <TextAreaForm
          name="requestCourseInfo.description"
          placeholder="강좌를 소개해 주세요"
        />

        <Summary />

        <TextForm
          name="requestCourseInfo.summary"
          placeholder="강좌 요약을 작성해주세요"
        />
        <TextAreaForm
          name="requestCourseInfo.announcement"
          placeholder="공지사항을 입력해주세요"
        />

        <NumberForm
          name="requestCourseInfo.maxEnrollments"
          placeholder="모집 최대 인원을 설정해주세요"
        />
        <NumberForm
          name="requestCourseInfo.level"
          placeholder="강좌의 난이도를 설정해주세요 (1~100)"
        />

        <div className={styles.middle}>
          이런걸 배울 수 있어요를 키워드 형식으로 작성해주세요
        </div>

        {/* RHF 등록 없이 임시 입력 전용 */}
        <CanLearnsForm
          name="requestCourseInfo.canLearns"
          placeholder="예: 플레이팅, 셰프 팁, 기본 칼질"
        />

        <LectureForm />

        <LectureList />

        <BaseButton
          type="submit"
          title="강좌 등록 요청하기"
          size="lg"
          variant="custom"
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

  // ❗빈 목록이면 샘플로 대체. 샘플 쓰는 경우 error는 숨김 처리
  const ongoingData = (
    ongoing.list?.length ? ongoing.list : sampleCourse1
  ) as CourseManage[];
  const ongoingError = ongoing.list?.length ? ongoing.error : "";

  const soonData = (
    soon.list?.length ? soon.list : sampleCourse2
  ) as CourseManage[];
  const soonError = soon.list?.length ? soon.error : "";

  const endedData = (
    ended.list?.length ? ended.list : sampleCourse3
  ) as CourseManage[];
  const endedError = ended.list?.length ? ended.error : "";

  const getKey = (i: CourseManage) => String(i.courseId);
  const getLabel = (i: CourseManage) => i.title;
  const renderContent = () => <CoursePanelDetail />;

  return (
    <div className={styles.container}>
      <SegmentedToggle
        options={["모집중", "예정", "종료"]}
        contents={[
          <VerticalTab
            key="ongoing"
            data={ongoingData}
            loading={ongoing.loading}
            error={ongoingError}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
          />,
          <VerticalTab
            key="soon"
            data={soonData}
            loading={soon.loading}
            error={soonError}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
          />,
          <VerticalTab
            key="end"
            data={endedData}
            loading={ended.loading}
            error={endedError}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
          />,
        ]}
      />
    </div>
  );
}
