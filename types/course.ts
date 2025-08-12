export interface CourseCard {
  specialBannerUrl?: string;
  title: string;
  courseId: number;
  isLive: boolean;
  courseStartDate: string;
  courseEndData: string;
  level: number;
  summary: string;
  description: string;
  announcement: string;
  viewerCount: number;
  category: string;
  responseFileInfo: {
    presignedUrl: string;
    name: string;
    sequence: number;
  };
  instructorId: number;
  instructorName: string;
  averageReviewScore: number;
  canLearns: string[];
  isEnrolled: boolean;
}


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

export interface MainCourse {
  id: number;
  title: string;
  instructorId: number;
  instructorName: string;
  thumbnail: string;
  category: string;
  difficulty: number;
  summary: string;
  learningPoints: string[];
  ratingAvg: number;
  isLive: boolean;
  viewerCount: number;
  startDate: string;
  endDate: string;
  isEnrolled: boolean;
}

export interface CourseDetail {
  thumbnailFileInfos: {
    presignedUrl: string;
    name: string;
    sequence: number;
  }[];
  courseCoverFileInfo: {
    presignedUrl: string;
    name: string;
    sequence: number;
  };
  title: string;
  courseStartDate: string; // YYYY-MM-DD
  courseEndDate: string; // YYYY-MM-DD
  instructorId: number;
  courseId: number;
  enrollmentStartDate: string; // ISO datetime
  enrollmentEndDate: string; // ISO datetime
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
  canLearns: string[];
  lectureSummaryList: {
    sequence: number;
    lectureId: number;
    title: string;
    startedAt: string; // ISO datetime
    isSkipped: boolean;
  }[];
}

export interface CreateCourseRequestFinal {
  requestCourseInfo: {
    title: string;
    enrollmentStartDate: string; // ISO 8601 (e.g. "2025-08-11T02:41:46.090Z")
    enrollmentEndDate: string; // ISO 8601
    categoryId: number;
    summary: string;
    maxEnrollments: number;
    description: string; // 설명
    level: number; // 난이도
    announcement: string; // 공지사항
    canLearns: string[]; // 이런걸 배울 수 있어요
  };
  thumbnailImages: string[]; // 썸네일 이미지 URL 목록
  courseCoverImage: string; // 커버 이미지 URL
}

export interface LecturePayload {
  lecture: Lecture[];
}

export interface Lecture {
  title: string;
  summary: string;
  sequence: number;
  materials: string;
  startedAt: string; // ISO date string
  endedAt: string; // ISO date string
  chapterList: Chapter[];
}

export interface Chapter {
  sequence: number;
  title: string;
  todoList: Todo[];
}

export interface Todo {
  sequence: number;
  title: string;
  type: "NORMAL" | "TIMER";
  seconds: number;
}

export type CourseManage = {
  thumbnailFileInfos?: {
    presignedUrl: string;
    name: string;
    sequence: number;
  }[];
  courseCoverFileInfo?: {
    presignedUrl: string;
    name: string;
    sequence: number;
  } | null;
  title: string;
  courseStartDate: string; // "YYYY-MM-DD"
  courseEndDate: string; // "YYYY-MM-DD"
  instructorId: number;
  courseId: number;
  enrollmentStartDate: string; // ISO
  enrollmentEndDate: string; // ISO
  category: string;
  reviewCount: number;
  averageReviewScore: number;
  summary: string;
  maxEnrollments: number;
  isEnrolled: boolean;
  description: string;
  level: number;
  isZzimed: boolean;
  isLive: boolean;
  announcement: string;
  isReviwed: boolean;
  canLearns: string[];
};

export type RequestCategory =
  | "special"
  | "enrolled"
  | "soon"
  | "search"
  | "zzim"
  | "complete"
  | "instructor";
export type CourseStatus = "soon" | "ongoing" | "end";
