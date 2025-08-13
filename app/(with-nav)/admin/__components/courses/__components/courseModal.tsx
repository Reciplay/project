import CustomButton from "@/components/button/customButton";
import CustomModal from "@/components/modal/customModal";
import { Course } from "@/types/course";
import styles from "../courses.module.scss";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: Course | null;
  loading?: boolean;
  onApprove: (courseId: number, message: string, isApprove: boolean) => void;
}

export default function CourseModal({
  isOpen,
  onClose,
  detail,
  loading = false,
  onApprove,
}: CourseModalProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {loading || !detail ? (
        <p className={styles.loadingText}>불러오는 중…</p>
      ) : (
        <>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>강좌 상세 정보</h3>
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

          {/* 하단 액션 */}
          <div className={styles.actions}>
            <CustomButton
              title="반려"
              size="md"
              variant="custom"
              color="red"
              onClick={() =>
                onApprove(detail.courseId, "강좌 등록 반려", false)
              }
            />
            <CustomButton
              title="승인"
              size="md"
              variant="custom"
              color="green"
              onClick={() => onApprove(detail.courseId, "강좌 등록 승인", true)}
            />
          </div>
        </>
      )}
    </CustomModal>
  );
}
