// app/admin/CourseList.tsx
"use client";

import styles from "./courseList.module.scss";
import commonStyles from "../../page.module.scss";
import useCourseList from "@/hooks/userCourseList";
// 날짜 포맷 함수
const formatDate = (date: string) => new Date(date).toLocaleDateString();

export default function CourseList() {
  const {
    sorted,
    loading,
    error,
    modalOpen,
    detail,
    detailLoading,
    openModal,
    closeModal,
  } = useCourseList();

  return (
    <>
      <section className={commonStyles.panel}>
        <div className={commonStyles.sectionTitle}>강좌 목록</div>
        <div className={commonStyles.tableWrapper}>
          {loading || error ? (
            <div className={commonStyles.input}>
              {loading ? "로딩 중…" : error}
            </div>
          ) : (
            <table className={commonStyles.table}>
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
                    <td>{formatDate(c.registeredAt)}</td>
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
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
