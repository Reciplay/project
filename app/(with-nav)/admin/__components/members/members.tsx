"use client";

import useMemberAdmin from "@/hooks/admin/useMemberAdmin";
import commonStyles from "../../page.module.scss";
import MemberModal from "./__components/memberModal";
import MemberTable from "./__components/memberTable";

export default function Members() {
  const {
    sorted,
    loading,
    error,
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
