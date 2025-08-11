// app/admin/InstructorRegisterList.tsx
"use client";

import commonStyles from "../../page.module.scss";
import styles from "./instructors.module.scss";
import HorizontalTab from "@/components/tab/horizontalTab";
import useInstructorAdmin from "@/hooks/admin/useInstructorAdmin";
import InstructorTable from "./__components/instructorTable";
import InstructorModal from "./__components/instructorModal";

export default function Instructors() {
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
  } = useInstructorAdmin();

  return (
    <>
      <section className={commonStyles.panel}>
        <div className={commonStyles.sectionTitle}>강사 목록</div>
        <HorizontalTab
          type="line"
          tabs={[
            {
              key: "1",
              label: "신청 중",
              content: (
                <InstructorTable list={sortedRegister} onRowClick={openModal} />
              ),
            },
            {
              key: "2",
              label: "승인 완료",
              content: (
                <InstructorTable list={sortedApproved} onRowClick={openModal} />
              ),
            },
          ]}
        />
      </section>
      <InstructorModal
        isOpen={modalOpen}
        onClose={closeModal}
        detail={detail}
        loading={detailLoading}
        onApprove={(id, action, isApproved) =>
          handleApprove(id, action, isApproved)
        }
      />
    </>
  );
}
