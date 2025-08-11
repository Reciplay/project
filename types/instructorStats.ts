import { NewQuestion } from "./qna";

export type InstructorStats = {
  totalStudents: number;
  averageStars: number;
  totalReviewCount: number;
  subscriberCount: number;
  profileImageUrl: string | null;
  newQuestions: NewQuestion[];
};

export type SubscriptionPoint = {
  date: string; // "YYYY-MM-DD"
  subscriber: number;
};
