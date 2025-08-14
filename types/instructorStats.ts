import { NewQuestion } from "./qna";

export type InstructorStats = {
  totalStudents: number;
  averageStars: number;
  totalReviewCount: number;
  subscriberCount: number;
  profileFileInfo: {
    presignedUrl: string;
    name: string;
    sequence: number;
  };
  newQuestions: NewQuestion[];
};

export type SubscriptionPoint = {
  date: string; // "YYYY-MM-DD"
  subscriber: number;
};
