// // app/admin/hooks/useCourseList.ts
// import { useEffect, useState } from "react";
// import restClient from "@/lib/axios/restClient";
// import { ApiResponse } from "@/types/apiResponse";
// import { Course, CourseSummary } from "@/types/course";

// // 샘플 데이터 (복사)
// const sampleCourses: CourseSummary[] = [
//   {
//     courseId: 1,
//     title: "React 입문",
//     instructorName: "홍길동",
//     registeredAt: "2025-07-01T10:00:00Z",
//   },
//   {
//     courseId: 2,
//     title: "TypeScript 마스터",
//     instructorName: "김철수",
//     registeredAt: "2025-07-05T14:30:00Z",
//   },
//   {
//     courseId: 3,
//     title: "Next.js와 SCSS",
//     instructorName: "이영희",
//     registeredAt: "2025-07-10T09:15:00Z",
//   },
// ];

// export const sampleCourseDetail: Course = {
//   courseId: 1001,
//   courseName: "React & Next.js 완벽 가이드",
//   courseStartDate: "2025-08-04",
//   courseEndDate: "2025-09-30",
//   instructorId: 42,
//   enrollmentStartDate: "2025-07-01",
//   enrollmentEndDate: "2025-08-03",
//   category: "Frontend",
//   summary: "React와 Next.js를 활용한 모던 웹 개발 종합 과정",
//   maxEnrollments: 25,
//   isEnrollment: true,
//   level: 2,
//   announcement: "첫 강의는 8월 4일(월) 오후 2시에 진행됩니다.",
//   description:
//     "이 과정에서는 React의 기초부터 고급 패턴, Next.js를 활용한 서버 사이드 렌더링과 최적화 기법까지 다룹니다.",
//   lectureDetails: [],
// };

// export default function useCourseAdmin() {
//   const [courses, setCourses] = useState<CourseSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [detail, setDetail] = useState<Course | null>(null);
//   const [detailLoading, setDetailLoading] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await restClient.get<ApiResponse<CourseSummary[]>>(
//           "/api/v1/course/admin/course/summaries"
//         );
//         setCourses(res.data.data);
//       } catch {
//         setCourses(sampleCourses);
//         // setError("서버 연결에 실패했습니다. (샘플 데이터 표시 중)");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const sorted = [...courses].sort(
//     (a, b) =>
//       new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
//   );

//   const openModal = async (courseId: number) => {
//     setModalOpen(true);
//     setDetailLoading(true);
//     try {
//       const res = await restClient.get<ApiResponse<Course>>(
//         "/api/v1/course/admin/course",
//         { params: { courseId } }
//       );
//       setDetail(res.data.data);
//     } catch {
//       setDetail(sampleCourseDetail);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setDetail(null);
//   };

//   return {
//     sorted,
//     loading,
//     error,
//     modalOpen,
//     detail,
//     detailLoading,
//     openModal,
//     closeModal,
//   };
// }
