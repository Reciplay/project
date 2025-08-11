"use client";

import BaseButton from "@/components/button/baseButton";
import restClient from "@/lib/axios/restClient";
import CategoryForm from "./__components/forms/categoryForm";
import LectureForm from "./__components/forms/lectureForm";
import LectureList from "./__components/forms/lectureList";
import NumberForm from "./__components/forms/numberForm";
import Summary from "./__components/forms/summary";
import TextAreaForm from "./__components/forms/textAreaForm";
import TextForm from "./__components/forms/textForm";
import ThumbNailForm from "./__components/forms/thumbnailForm";
import styles from "./page.module.scss";
import { message } from "antd";
import { useCreateCourseStore } from "@/hooks/course/useCreateCourseStore";
import CanLearnsForm from "./__components/forms/canLearnsForm";
import { useState } from "react";

export default function Page() {
  const { validateAll, buildPayload, reset } = useCreateCourseStore();
  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const { ok, messages } = validateAll();
    if (!ok) {
      alert(messages.join("\n")); // 미기입 항목 그대로 안내
      return;
    }
    const payload = buildPayload();
    try {
      const res = await restClient.post("/course/courses",
        payload,
        {
          requireAuth: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.status !== 200) {
        message.error("등록 실패");
        console.error(res.data)
        return;
      }
      message.success("강좌가 등록되었습니다.");
      console.log(res.data);
      reset();
    } catch {
      message.error("요청 오류");
    }
  };


  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.content}>
        <ThumbNailForm thumbnailName="thumbnailImages" coverName="courseCoverImage" />

        <div className={styles.title}>세부 설정</div>
        <div className={styles.line} />

        {/* ⬇⬇ 반드시 중첩 경로로! */}
        <TextForm name="requestCourseInfo.title" placeholder="강좌명을 입력해주세요" />
        <CategoryForm name="requestCourseInfo.categoryId" label="카테고리" />
        <TextAreaForm name="requestCourseInfo.description" placeholder="강좌를 소개해 주세요" />

        <Summary />

        <TextForm name="requestCourseInfo.summary" placeholder="강좌 요약을 작성해주세요" />
        <TextAreaForm name="requestCourseInfo.announcement" placeholder="공지사항을 입력해주세요" />

        <NumberForm name="requestCourseInfo.maxEnrollments" placeholder="모집 최대 인원을 설정해주세요" />
        <NumberForm name="requestCourseInfo.level" placeholder="강좌의 난이도를 설정해주세요 (1~100)" />

        <div className={styles.middle}>이런걸 배울 수 있어요를 키워드 형식으로 작성해주세요</div>

        {/* RHF 등록 없이 임시 입력 전용 */}
        <CanLearnsForm
          name="requestCourseInfo.canLearns"
          placeholder="예: 플레이팅, 셰프 팁, 기본 칼질"
        />

        <LectureForm
        />

        <LectureList />

        <BaseButton type="submit" title="강좌 등록 요청하기" size="lg" variant="custom" />
      </div>
    </form>
  );
}
