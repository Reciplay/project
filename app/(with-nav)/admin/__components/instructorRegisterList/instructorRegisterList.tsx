// app/admin/InstructorRegisterList.tsx
"use client";

import commonStyles from "../../page.module.scss";
import styles from "./instructorRegisterList.module.scss";
import IconWithText from "@/components/text/iconWithText";
import Image from "next/image";
import Introduction from "../../../instructor/register/__components/introduction";
import Certificate from "../../../instructor/register/__components/certificate";
import Career from "../../../instructor/register/__components/career";
import BaseButton from "@/components/button/baseButton";
import useInstructorRegisterList from "@/hooks/useInstructorRegisterList";

const formatDate = (date: string) => new Date(date).toLocaleDateString();

export default function InstructorRegisterList() {
  const {
    sorted,
    loading,
    error,
    modalOpen,
    detail,
    detailLoading,
    openModal,
    closeModal,
    handleApprove,
  } = useInstructorRegisterList();

  return (
    <>
      <section className={commonStyles.panel}>
        <div className={commonStyles.sectionTitle}>강사 신청 목록</div>
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
                  <th>이름</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((inst) => (
                  <tr
                    key={inst.instructorId}
                    onClick={() => openModal(inst.instructorId)}
                  >
                    <td>{formatDate(inst.registeredAt)}</td>
                    <td>{inst.name}</td>
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
                <div className={styles.frame}>
                  <div className={styles.textContainer}>
                    <span className={styles.name}>{detail.name}</span>
                    <span>
                      {detail.birthDate} ({detail.nickName})
                    </span>
                    <div className={styles.innerText}>
                      <IconWithText iconName="email" title={detail.email} />
                      {/* 강의 분야 등은 필요에 맞게 */}
                    </div>
                    <IconWithText iconName="address" title={detail.address} />
                    <IconWithText iconName="phone" title={detail.phoneNumber} />
                  </div>
                  <div className={styles.imageWrapper}>
                    <Image
                      src="/images/profile2.jpg"
                      fill
                      alt="profile"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className={styles.infoContainer}>
                  <Introduction />
                  <Certificate />
                  <Career />
                </div>
                <div className={styles.actions}>
                  <BaseButton
                    title="강사 등록"
                    className={styles.btnRegister}
                    onClick={() =>
                      handleApprove(detail.instructorId, "강사 등록 승인", true)
                    }
                  />
                  <BaseButton
                    title="반려"
                    className={styles.btnRegister}
                    onClick={() =>
                      handleApprove(
                        detail.instructorId,
                        "강사 등록 반려",
                        false
                      )
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
