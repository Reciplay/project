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
  criteria: string;
  from: string;
  to: string;
  series: PeriodSubscription[];
};

export type PeriodSubscription = {
  t: string; // yyyy-mm-dd
  subscribers: number;
};
