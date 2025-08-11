// app/admin/CourseList.tsx
"use client";

import styles from "./courses.module.scss";
import commonStyles from "../../page.module.scss";
import useCourseAdmin from "@/hooks/admin/useCourseAdmin";
import HorizontalTab from "@/components/tab/horizontalTab";
import CourseTable from "./__components/courseTable";
import CourseModal from "./__components/courseModal";
// 날짜 포맷 함수
const formatDate = (date: string) => new Date(date).toLocaleDateString();

export default function Courses() {
  const {
    loading,
    error,
    sortedApproved,
    sortedRegister,
    modalOpen,
    detail,
    detailLoading,
    openModal,
    closeModal,
    handleApprove,
  } = useCourseAdmin();

  return (
    <>
      <section className={commonStyles.panel}>
        <div className={commonStyles.sectionTitle}>강좌 목록</div>

        {loading || error ? (
          <div className={commonStyles.input}>
            {loading ? "로딩 중…" : error}
          </div>
        ) : (
          <HorizontalTab
            type="line"
            tabs={[
              {
                key: "1",
                label: "신청 중",
                content: (
                  <CourseTable list={sortedRegister} onRowClick={openModal} />
                ),
              },
              {
                key: "2",
                label: "승인 완료",
                content: (
                  <CourseTable list={sortedApproved} onRowClick={openModal} />
                ),
              },
            ]}
          />
        )}
      </section>

      <CourseModal
        isOpen={modalOpen}
        onClose={closeModal}
        detail={detail}
        loading={detailLoading}
        onApprove={(id, msg, ok) => handleApprove(id, msg, ok)}
      />
    </>
  );
}
