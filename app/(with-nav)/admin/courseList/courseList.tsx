// app/admin/CourseList.tsx
"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useEffect, useState } from "react";
import styles from "./courseList.module.scss";
import { Course } from "@/types/course";

export interface CourseSummary {
  courseId: number;
  title: string;
  instructorName: string;
  registeredAt: string;
}

// export interface CourseDetail {
//   courseId: number;
//   title: string;
//   description: string;
//   instructorName: string;
//   registeredAt: string;
//   curriculum?: string;
// }

const sampleCourses: CourseSummary[] = [
  {
    courseId: 1,
    title: "React 입문",
    instructorName: "홍길동",
    registeredAt: "2025-07-01T10:00:00Z",
  },
  {
    courseId: 2,
    title: "TypeScript 마스터",
    instructorName: "김철수",
    registeredAt: "2025-07-05T14:30:00Z",
  },
  {
    courseId: 3,
    title: "Next.js와 SCSS",
    instructorName: "이영희",
    registeredAt: "2025-07-10T09:15:00Z",
  },
];

export const sampleCourseDetail: Course = {
  courseId: 1001,
  courseName: "React & Next.js 완벽 가이드",
  courseStartDate: "2025-08-04",
  courseEndDate: "2025-09-30",
  instructorId: 42,
  enrollmentStartDate: "2025-07-01",
  enrollmentEndDate: "2025-08-03",
  category: "Frontend",
  summary: "React와 Next.js를 활용한 모던 웹 개발 종합 과정",
  maxEnrollments: 25,
  isEnrollment: true,
  level: 2,
  announcement: "첫 강의는 8월 4일(월) 오후 2시에 진행됩니다.",
  description:
    "이 과정에서는 React의 기초부터 고급 패턴, Next.js를 활용한 서버 사이드 렌더링과 최적화 기법까지 다룹니다.",
  lectureDetails: [
    {
      lectureId: 501,
      sequence: 1,
      name: "오리엔테이션 및 환경설정",
      summary: "강의 목표 소개 및 개발 환경 구축",
      materials: "프로젝트 템플릿, 설치 가이드",
      isSkipped: false,
      resourceName: "orientation.zip",
      startedAt: "2025-08-04",
      endedAt: "2025-08-04",
      chapters: [
        {
          sequence: 1,
          title: "개발 환경 설치",
          todos: [
            { sequence: 1, title: "Node.js 설치", type: 0, seconds: 300 },
            { sequence: 2, title: "VSCode 설정", type: 0, seconds: 180 },
          ],
        },
        {
          sequence: 2,
          title: "프로젝트 구조 이해",
          todos: [
            { sequence: 1, title: "디렉토리 살펴보기", type: 1, seconds: 240 },
          ],
        },
      ],
    },
    {
      lectureId: 502,
      sequence: 2,
      name: "React 기초",
      summary: "컴포넌트, 상태 관리, 이벤트 처리",
      materials: "코드 샘플, 실습 자료",
      isSkipped: false,
      resourceName: "react-basics.zip",
      startedAt: "2025-08-06",
      endedAt: "2025-08-06",
      chapters: [
        {
          sequence: 1,
          title: "JSX와 컴포넌트",
          todos: [
            { sequence: 1, title: "JSX 문법 이해", type: 0, seconds: 600 },
            {
              sequence: 2,
              title: "Functional Component 실습",
              type: 1,
              seconds: 900,
            },
          ],
        },
        {
          sequence: 2,
          title: "useState 사용법",
          todos: [
            { sequence: 1, title: "상태 관리 실습", type: 1, seconds: 800 },
          ],
        },
      ],
    },
  ],
};

export default function CourseList() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<Course | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await restClient.get<ApiResponse<CourseSummary[]>>(
          "/api/v1/course/admin/course/summaries"
        );
        setCourses(res.data.data);
      } catch {
        setCourses(sampleCourses);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sorted = [...courses].sort(
    (a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  );

  const openModal = async (courseId: number) => {
    setModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await restClient.get<ApiResponse<Course>>(
        "/api/v1/course/admin/course",
        { params: { courseId } }
      );
      setDetail(res.data.data);
    } catch {
      setDetail(sampleCourseDetail);
    } finally {
      setDetailLoading(false);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setDetail(null);
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.sectionTitle}>강좌 목록</div>
        <div className={styles.tableWrapper}>
          {loading || error ? (
            <div className={styles.input}>{loading ? "로딩 중…" : error}</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>등록일</th>
                  <th>제목</th>
                  <th>강사</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => (
                  <tr key={c.courseId} onClick={() => openModal(c.courseId)}>
                    <td>{new Date(c.registeredAt).toLocaleDateString()}</td>
                    <td>{c.title}</td>
                    <td>{c.instructorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <p>불러오는 중…</p>
            ) : detail ? (
              <div className={styles.modalContent}>
                <h3>강좌 상세 정보</h3>

                <ul className={styles.detailList}>
                  <li>
                    <strong>ID:</strong> {detail.courseId}
                  </li>
                  <li>
                    <strong>강좌명:</strong> {detail.courseName}
                  </li>
                  <li>
                    <strong>강좌 기간:</strong> {detail.courseStartDate} ∼{" "}
                    {detail.courseEndDate}
                  </li>
                  <li>
                    <strong>신청 기간:</strong> {detail.enrollmentStartDate} ∼{" "}
                    {detail.enrollmentEndDate}
                  </li>
                  <li>
                    <strong>카테고리:</strong> {detail.category}
                  </li>
                  <li>
                    <strong>요약:</strong> {detail.summary}
                  </li>
                  <li>
                    <strong>최대 인원:</strong> {detail.maxEnrollments}명
                  </li>
                  <li>
                    <strong>수강 가능:</strong>{" "}
                    {detail.isEnrollment ? "가능" : "마감"}
                  </li>
                  <li>
                    <strong>난이도:</strong> {detail.level}
                  </li>
                  <li>
                    <strong>공지사항:</strong> {detail.announcement}
                  </li>
                  <li>
                    <strong>설명:</strong> {detail.description}
                  </li>
                </ul>

                {/* 필요하다면 여기에 LectureDetails 요약 컴포넌트 추가 */}

                {/* <div className={styles.actions}>
                  <button
                    className={`${styles.btn} ${styles.btnRegister}`}
                    onClick={handleRegister}
                  >
                    등록
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnClose}`}
                    onClick={closeModal}
                  >
                    닫기
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnReject}`}
                    onClick={handleReject}
                  >
                    반려
                  </button> */}
                {/* </div> */}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
