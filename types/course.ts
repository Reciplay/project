export interface Course {
  id: number; // 강좌 ID
  title: string; // 강좌 명

  instructorId: number; // 강사 ID
  instructorName: string; // 강사 이름

  thumbnail: string; // 썸네일 이미지 URL

  category: string; // 카테고리 (예: 요리, 제과 등)
  difficulty: number; // 난이도
  summary: string; // 요약
  learningPoints: string[]; // 이런 걸 배울 수 있어요

  ratingAvg: number; // 평균 별점 (예: 4.7)
  isLive: boolean; // 라이브 여부
  viewerCount: number; // 현재 시청자 수

  startDate: string; // 강좌 시작일
  endDate: string; // 강좌 종료일

  isEnrolled: boolean; // 수강 여부
}
