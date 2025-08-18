"use client";

import CustomModal from "@/components/modal/customModal";
import { usePostQnaQuestion } from "@/hooks/qna/usePostQnaQuestion";
import { useQnaDetail } from "@/hooks/qna/useQnaDetail";
import { useQnaSummary } from "@/hooks/qna/useQnaSummary";
import { useState } from "react";
import styles from "./qna.module.scss";

// 질문 등록 모달
const QuestionFormModal = ({
  isOpen,
  onClose,
  courseId,
  onQuestionPosted,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onQuestionPosted: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { postQuestion, loading, error } = usePostQnaQuestion();

  const handleSubmit = async () => {
    const success = await postQuestion({
      courseId: Number(courseId),
      title,
      questionContent: content,
    });

    if (success) {
      setTitle("");
      setContent("");
      onQuestionPosted(); // 목록 새로고침
      onClose(); // 모달 닫기
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.qnaForm}>
        <h3>질문하기</h3>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="질문 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "등록 중..." : "질문 등록"}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </CustomModal>
  );
};

// Q&A 상세 정보 모달
const QnaDetailView = ({ qnaId }: { qnaId: number }) => {
  const { data, loading, error } = useQnaDetail(qnaId);

  if (loading)
    return (
      <div className={styles.modalLoading}>질문 내용을 불러오는 중...</div>
    );
  if (error) return <div className={styles.modalError}>오류: {error}</div>;
  if (!data) return null;

  return (
    <div className={styles.modalContent}>
      <div className={styles.modalHeader}>
        <span
          className={
            data.answerContent ? styles.answeredTag : styles.pendingTag
          }
        >
          {data.answerContent ? "답변 완료" : "답변 대기중"}
        </span>
        <h3 className={styles.modalTitle}>{data.title}</h3>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.questionSection}>
          <p>{data.questionContent}</p>
        </div>
        {data.answerContent && (
          <div className={styles.answerSection}>
            <h4>답변</h4>
            <p>{data.answerContent}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function QnA({ courseId }: { courseId: string }) {
  const { list, loading, message, page, totalPages, setPage, reload } =
    useQnaSummary(courseId, 5);
  const [selectedQnaId, setSelectedQnaId] = useState<number | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const handleQnaClick = (qnaId: number) => {
    setSelectedQnaId(qnaId);
  };

  const handleCloseDetailModal = () => {
    setSelectedQnaId(null);
  };

  return (
    <div className={styles.section}>
      <div className={styles.qnaHeader}>
        <h2>Q&A</h2>
        <button
          className={styles.askButton}
          onClick={() => setIsQuestionModalOpen(true)}
        >
          질문하기
        </button>
      </div>

      <QuestionFormModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        courseId={courseId}
        onQuestionPosted={reload}
      />

      {/* 로딩 상태 */}
      {loading && list.length === 0 && (
        <div className={styles.skeletonList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonItem} />
          ))}
        </div>
      )}

      {/* 에러 메시지 */}
      {message && list.length === 0 && (
        <div className={styles.error}>{message}</div>
      )}

      {/* 비어있을 때 */}
      {!loading && !message && list.length === 0 && (
        <div className={styles.empty}>등록된 Q&A가 없습니다.</div>
      )}

      {/* Q&A 목록 */}
      <ul className={styles.qnaList}>
        {list.map((item) => (
          <li
            key={item.qnaId}
            className={styles.qnaItem}
            onClick={() => handleQnaClick(item.qnaId)}
          >
            <div className={styles.title}>{item.title}</div>
            <div className={styles.meta}>
              <span className={styles.nickname}>{item.questionerNickname}</span>
              <span className={styles.dot}>•</span>
              <time className={styles.date}>
                {new Date(item.questionAt).toLocaleDateString("ko-KR")}
              </time>
              {item.isAnswered && (
                <span className={styles.answered}>답변 완료</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`${styles.pageBtn} ${page === pageNum ? styles.active : ""}`}
                disabled={loading}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      {/* 상세 정보 Modal */}
      {selectedQnaId && (
        <CustomModal isOpen={!!selectedQnaId} onClose={handleCloseDetailModal}>
          <QnaDetailView qnaId={selectedQnaId} />
        </CustomModal>
      )}
    </div>
  );
}
