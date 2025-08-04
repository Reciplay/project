// app/admin/MemberList.tsx
"use client";

import styles from "./memberList.module.scss";
import commonStyles from "../../page.module.scss";
import useMemberList from "@/hooks/userMemberList";
// 날짜 포맷 함수(있으면 utils로 분리)
const formatDate = (date: string) => new Date(date).toLocaleDateString();
const formatDateTime = (date: string) => new Date(date).toLocaleString();

export default function MemberList() {
  const {
    members,
    loading,
    error,
    modalOpen,
    selected,
    detailLoading,
    openModal,
    closeModal,
  } = useMemberList();

  return (
    <>
      <section className={commonStyles.panel}>
        <div className={commonStyles.sectionTitle}>회원 목록</div>
        <div className={commonStyles.tableWrapper}>
          {loading || error ? (
            <div className={commonStyles.input}>
              {loading ? "로딩 중…" : error}
            </div>
          ) : (
            <table className={commonStyles.table}>
              <thead>
                <tr>
                  <th>가입일</th>
                  <th>이름</th>
                  <th>이메일</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.userId} onClick={() => openModal(m.userId)}>
                    <td>{formatDate(m.createdAt)}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
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
            ) : selected ? (
              <div className={styles.modalContent}>
                <h3>회원 상세 정보</h3>
                <ul className={styles.detailList}>
                  <li>
                    <strong>아이디:</strong> {selected.userId}
                  </li>
                  <li>
                    <strong>이름:</strong> {selected.name}
                  </li>
                  <li>
                    <strong>닉네임:</strong> {selected.nickname}
                  </li>
                  <li>
                    <strong>이메일:</strong> {selected.email}
                  </li>
                  <li>
                    <strong>직업:</strong> {selected.job}
                  </li>
                  <li>
                    <strong>생년월일:</strong> {selected.birthDate}
                  </li>
                  <li>
                    <strong>가입일:</strong>{" "}
                    {formatDateTime(selected.createdAt)}
                  </li>
                  <li>
                    <strong>역할:</strong>{" "}
                    {selected.role ? "관리자" : "일반 회원"}
                  </li>
                </ul>
                <div className={styles.actions}>
                  <button
                    className={`${styles.btn} ${styles.btnClose}`}
                    onClick={closeModal}
                  >
                    강퇴
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnClose}`}
                    onClick={closeModal}
                  >
                    닫기
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
