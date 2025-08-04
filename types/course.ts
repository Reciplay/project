export interface Course {
  courseId: number;
  courseName: string;
  courseStartDate: string; // YYYY-MM-DD
  courseEndDate: string; // YYYY-MM-DD
  instructorId: number;
  enrollmentStartDate: string; // YYYY-MM-DD
  enrollmentEndDate: string; // YYYY-MM-DD
  category: string;
  summary: string;
  maxEnrollments: number;
  isEnrollment: boolean;
  level: number;
  announcement: string;
  description: string;
  lectureDetails: LectureDetail[];
}

export interface CourseSummary {
  courseId: number;
  title: string;
  instructorName: string;
  registeredAt: string;
}

export interface Todo {
  sequence: number;
  title: string;
  type: number;
  seconds: number;
}

export interface Chapter {
  sequence: number;
  title: string;
  todos: Todo[];
}

export interface LectureDetail {
  lectureId: number;
  sequence: number;
  name: string;
  summary: string;
  materials: string;
  isSkipped: boolean;
  resourceName: string;
  startedAt: string; // YYYY-MM-DD
  endedAt: string; // YYYY-MM-DD
  chapters: Chapter[];
}

export interface CreateCourseRequest {
  courseName: string;
  courseStartDate: string;
  courseEndDate: string;
  instructorId: number;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  category: string;
  reviewCount: number;
  averageReviewScore: number;
  summary: string;
  maxEnrollments: number;
  isEnrollment: boolean;
  description: string;
  level: number;
  isZzim: boolean;
  isLive: boolean;
  announcement: string;
  isReviwed: boolean;
}
