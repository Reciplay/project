"use client";

import BaseButton from "@/components/button/baseButton";
import {
  uploadLectures,
  useCreateCourseStore,
} from "@/hooks/course/useCreateCourseStore";
import restClient from "@/lib/axios/restClient";
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
  const { validateAll, buildFormData, reset } = useCreateCourseStore();
  const { values } = useCreateCourseStore(); // ✅ lectures 읽기용

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const { ok, messages } = validateAll();
    if (!ok) {
      alert(messages.join("\n"));
      return;
    }

    const formData = buildFormData();

    try {
      const res = await restClient.post("/course/courses", formData, {
        requireAuth: true,
      });

      if (res.status !== 200) {
        console.error("등록 실패");
        console.error(res.data);
        return;
      }

      // ✅ courseId 안전 추출
      const courseId =
        res.data?.data?.courseId ??
        res.data?.data?.id ??
        res.data?.courseId ??
        res.data?.id;

      if (!courseId) {
        console.log("courseId를 찾을 수 없습니다.");
        return;
      }

      // ✅ 강의 업로드 (비어있으면 생략 가능)
      if (values.lectures && values.lectures.length > 0) {
        const lectureRes = await uploadLectures(courseId, values.lectures);
        if (lectureRes.status !== 200) {
          console.log("강의 업로드 실패");
          return;
        }
      }

      console.log("강좌/강의가 등록되었습니다.");
      reset();
    } catch (err) {
      console.log(err);

      console.log("요청 오류");
    }
  };

  return (
    <form className={styles.container} onSubmit={onSubmit}>
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
