// components/admin/MemberModal.tsx
"use client";

import CustomModal from "@/components/modal/customModal";
import styles from "../members.module.scss";
import { useMemo } from "react";
import { UserDetail } from "@/types/user";
import CustomButton from "@/components/button/customButton";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: UserDetail | null;
  loading?: boolean;
  onDelete: (userId: number) => void; // 강퇴(탈퇴) 핸들러
}

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export default function MemberModal({
  isOpen,
  onClose,
  detail,
  loading = false,
  onDelete,
}: MemberModalProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {loading || !detail ? (
        <p className={styles.loadingText}>불러오는 중…</p>
      ) : (
        <div className={styles.modalContent}>
          <h3>회원 상세 정보</h3>
          <ul className={styles.detailList}>
            <li>
              <strong>아이디:</strong> {detail.userId}
            </li>
            <li>
              <strong>이름:</strong> {detail.name}
            </li>
            <li>
              <strong>닉네임:</strong> {detail.nickname}
            </li>
            <li>
              <strong>이메일:</strong> {detail.email}
            </li>
            <li>
              <strong>직업:</strong> {detail.job}
            </li>
            <li>
              <strong>생년월일:</strong> {detail.birthDate}
            </li>
            <li>
              <strong>가입일:</strong> {formatDateTime(detail.createdAt)}
            </li>
            <li>
              <strong>역할:</strong> {detail.role ? "관리자" : "일반 회원"}
            </li>
          </ul>
          <div className={styles.actions}>
            <CustomButton
              title="강퇴"
              size="md"
              variant="custom"
              color="red"
              onClick={() => {
                if (confirm("정말로 이 회원을 강퇴하시겠습니까?")) {
                  onDelete(detail.userId);
                }
              }}
            />
          </div>
        </div>
      )}
    </CustomModal>
  );
}
