// app/admin/MemberList.tsx
"use client";

import styles from "./members.module.scss";
import commonStyles from "../../page.module.scss";
import MemberTable from "./__components/memberTable";
import useMemberAdmin from "@/hooks/admin/useMemberAdmin";
import MemberModal from "./__components/memberModal";

export default function Members() {
  const {
    list,
    sorted,
    loading,
    error,
    refetch,

    // 상세/모달
    modalOpen,
    detail,
    detailLoading,
    openModal,
    closeModal,

    // 액션
    deleteMember,
  } = useMemberAdmin();

  return (
    <>
      <section className={commonStyles.panel}>
        <div className={commonStyles.sectionTitle}>회원 목록</div>

        {loading || error ? (
          <div className={commonStyles.input}>
            {loading ? "로딩 중…" : error}
          </div>
        ) : (
          // 정렬된 리스트 사용 (필요하면 list로 교체)
          <MemberTable list={sorted} onRowClick={openModal} />
        )}
      </section>

      {/* ✅ 모달은 오버레이 중복 없이 바로 사용 */}
      <MemberModal
        isOpen={modalOpen}
        onClose={closeModal}
        detail={detail}
        loading={detailLoading}
        onDelete={(userId) => deleteMember(userId)}
      />
    </>
  );
}
