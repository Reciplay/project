// components/admin/InstructorModal.tsx
"use client";

import CareersTable from "@/app/(with-nav)/instructor/register/__components/careerTable/careerTable";
import CertificatesTable from "@/app/(with-nav)/instructor/register/__components/certificatesTable/certificatesTable";
import CustomButton from "@/components/button/customButton";
import CustomModal from "@/components/modal/customModal";
import IconWithText from "@/components/text/iconWithText";
import { InstructorDetail } from "@/types/instructor";
import Image from "next/image";
import styles from "../instructors.module.scss";

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: InstructorDetail | null; // 로딩 전 null 가능
  onApprove: (
    instructorId: number,
    action: string,
    isApproved: boolean,
  ) => void;
  onReject?: (
    instructorId: number,
    action: string,
    isApproved: boolean,
  ) => void; // 선택
  loading?: boolean;
}

export default function InstructorModal({
  isOpen,
  onClose,
  detail,
  onApprove,
  onReject,
  loading = false,
}: InstructorModalProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {loading || !detail ? (
        <p className={styles.loadingText}>불러오는 중…</p>
      ) : (
        <>
          {/* 헤더 영역 */}
          <div className={styles.headerRow}>
            <div className={styles.frame}>
              <div className={styles.textContainer}>
                <span className={styles.name}>{detail.name}</span>
                <span className={styles.subMeta}>
                  {detail.birthDate} ({detail.nickName})
                </span>
                <div className={styles.innerText}>
                  <IconWithText iconName="email" title={detail.email} />
                </div>
                <IconWithText iconName="address" title={detail.address} />
                <IconWithText
                  iconName="phoneNumber"
                  title={detail.phoneNumber}
                />
              </div>

              <div className={styles.imageWrapper} aria-hidden="true">
                <Image
                  src="/images/profile2.jpg"
                  alt="profile"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="160px"
                />
              </div>
            </div>
          </div>

          {/* 소개말 */}
          <section className={styles.section}>
            <h3 className={styles.title}>소개말</h3>
            <div className={styles.sectionBody}>
              {detail.introduction?.trim() ? (
                <p className={styles.paragraph}>{detail.introduction}</p>
              ) : (
                <p className={styles.muted}>등록된 소개가 없습니다.</p>
              )}
            </div>
          </section>

          {/* 자격증 */}
          <section className={styles.section}>
            <h3 className={styles.title}>자격증</h3>
            <div className={styles.sectionBody}>
              <CertificatesTable />
            </div>
          </section>

          {/* 경력 */}
          <section className={styles.section}>
            <h3 className={styles.title}>경력</h3>
            <div className={styles.sectionBody}>
              <CareersTable />
            </div>
          </section>

          {/* 액션 버튼 (sticky footer) */}
          <div className={styles.actions}>
            <CustomButton
              title="반려"
              size="md"
              variant="custom"
              color="red"
              onClick={() =>
                (onReject ?? onApprove)(
                  detail.instructorId,
                  "강사 등록 반려",
                  false,
                )
              }
            />
            <CustomButton
              title="승인"
              size="md"
              variant="custom"
              color="green"
              onClick={() =>
                onApprove(detail.instructorId, "강사 등록 승인", true)
              }
            />
          </div>
        </>
      )}
    </CustomModal>
  );
}
