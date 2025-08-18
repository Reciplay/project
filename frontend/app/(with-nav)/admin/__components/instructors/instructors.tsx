"use client";

import HorizontalTab from "@/components/tab/horizontalTab";
import useInstructorAdmin from "@/hooks/admin/useInstructorAdmin";
import commonStyles from "../../page.module.scss";
import InstructorModal from "./__components/instructorModal";
import InstructorTable from "./__components/instructorTable";

export default function Instructors() {
  const {
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
