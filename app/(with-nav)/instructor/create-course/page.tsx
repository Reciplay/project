"use client";

// import Create from "./__components/create/create";
import BaseButton from "@/components/button/baseButton";
import { ApiResponse } from "@/types/apiResponse";
import { CreateCourseRequest } from "@/types/course";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import CategoryForm from "./__components/forms/categoryForm";
import LectureForm from "./__components/forms/lectureForm";
import LectureList from "./__components/forms/lectureList";
import NumberForm from "./__components/forms/numberForm";
import Summary from "./__components/forms/summary";
import TextAreaForm from "./__components/forms/textAreaForm";
import TextForm from "./__components/forms/textForm";
import ThumbNailForm from "./__components/forms/thumbnailForm";
import styles from "./page.module.scss";

// export default function Page() {
//   return (
//     <div className={styles.container}>
//       <Create />
//     </div>
//   );
// }

export default function Page() {
  const methods = useForm<CreateCourseRequest>({
    defaultValues: {
      courseName: "",
      courseStartDate: "",
      courseEndDate: "",
      instructorId: null,
      enrollmentStartDate: "",
      enrollmentEndDate: "",
      category: "Korean",
      reviewCount: null,
      averageReviewScore: null,
      summary: "",
      maxEnrollments: null,
      isEnrollment: false,
      description: "",
      level: null,
      isZzim: false,
      isLive: false,
      announcement: "",
      isReviwed: false,
    },
  });

  const onSubmit = async (data: CreateCourseRequest) => {
    try {
      const res = await fetch("/api/rest/course/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Use `object` (or `Record<string, unknown>`) for data
      const body = (await res.json()) as ApiResponse<object>;

      if (!res.ok) {
        message.error(body.message);
        console.error("등록 실패:", body);
        return;
      }

      message.success(body.message);
      console.log("서버 응답 data:", body.data);
      methods.reset();
      // router.push("/courses");
    } catch (err) {
      console.error("등록 요청 중 오류 발생:", err);
      message.error("강좌 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={styles.container}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className={styles.content}>
          {/* Todo! - SWAGGER 수정 후 반영 */}
          <ThumbNailForm />

          <div className={styles.title}>세부 설정</div>

          <div className={styles.line} />

          <TextForm name="courseName" placeholder="강좌명을 입력해주세요" />
          <CategoryForm
            name="category"
            label="어떤 분야의 강좌를 진행할 예정인가요?"
          />
          <TextAreaForm name="description" placeholder="강좌를 소개해 주세요" />

          <Summary />

          <TextForm name="summary" placeholder="강좌 요약을 작성해주세요" />
          <TextAreaForm
            name="announcement"
            placeholder="공지사항을 입력해주세요"
          />

          <NumberForm
            name="maxEnrollments"
            placeholder="모집 최대 인원을 설정해주세요"
          />
          <NumberForm
            name="level"
            placeholder="강좌의 난이도를 설정해주세요 (1~100)"
          />
          <div className={styles.middle}>
            이런걸 배울 수 있어요를 작성해주세요
          </div>

          {/* Todo! - SWAGGER 수정 후 반영 */}
          <TextAreaForm
            name="courseEndDate"
            placeholder="ex) 깔끔한 플레이팅과 셰프 팁까지!"
          />

          {/* Todo! - SWAGGER 수정 후 반영 */}
          <LectureForm />
          {/* Todo! - SWAGGER 수정 후 반영 */}
          <LectureList />

          <BaseButton
            type="submit"
            title="강좌 등록 요청하기"
            size="lg"
            variant="custom"
          />
        </div>
      </form>
    </FormProvider>
  );
}
