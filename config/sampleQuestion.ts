import { InstructorStats } from "@/types/instructorStats";
import type { NewQuestion } from "@/types/qna";

export const dummyQuestions: NewQuestion[] = [
  {
    id: 1,
    title: "이 강의에서 사용하는 재료는 어디서 구할 수 있나요?",
    content:
      "혹시 재료를 구매할 수 있는 온라인 링크나 오프라인 매장이 있을까요?",
    questionAt: "2025-07-29T10:24:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
  {
    id: 2,
    title: "요리 순서를 조금 더 자세히 설명해주실 수 있나요?",
    content: "영상에 나온 과정이 조금 빨라서 따라가기 힘들었어요.",
    questionAt: "2025-07-30T08:12:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
  {
    id: 3,
    title: "영상 속 조리도구 브랜드가 궁금합니다.",
    content: "특히 프라이팬과 칼 브랜드가 궁금합니다.",
    questionAt: "2025-07-30T14:05:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
  {
    id: 4,
    title: "초보자가 하기 어려운 단계가 있다면 알려주세요.",
    content: "조리 중에서 특히 주의해야 할 부분이 있나요?",
    questionAt: "2025-07-31T09:48:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
  {
    id: 5,
    title: "간을 조절하는 팁이 있으면 공유해주세요.",
    content: "짭짤함을 줄이고 싶을 때 어떤 재료를 쓰면 좋을까요?",
    questionAt: "2025-07-31T16:20:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
  {
    id: 6,
    title: "이 강좌 이후 추천하는 다음 강좌가 있을까요?",
    content: "기본기를 익힌 후 배울 수 있는 심화 과정이 궁금합니다.",
    questionAt: "2025-08-01T07:15:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
  {
    id: 7,
    title: "강의에서 사용하는 고추장은 어떤 종류인가요?",
    content: "집에서 쓰는 고추장과 맛이 조금 달라서 궁금합니다.",
    questionAt: "2025-08-01T15:40:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
  {
    id: 8,
    title: "채소 손질 팁도 다뤄주실 수 있나요?",
    content: "특히 대파와 마늘 손질 방법이 궁금합니다.",
    questionAt: "2025-08-02T12:00:00Z",
    courseName: "한식 기초 마스터",
    courseId: 101,
  },
];
export const dummyInstructorStats: InstructorStats = {
  totalStudents: 128,
  averageStars: 4.7,
  totalReviewCount: 56,
  subscriberCount: 42,
  profileFileInfo: {
    presignedUrl: "string",
    name: "string",
    sequence: 0,
  },
  newQuestions: dummyQuestions,
};
