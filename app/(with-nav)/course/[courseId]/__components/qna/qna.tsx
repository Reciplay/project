"use client";

import { useQnaSummary } from "@/hooks/qna/useQnaSummary";
import styles from "./qna.module.scss";

export default function QnA({ courseId }: { courseId: string }) {
  const { list, loading, message, hasMore, fetchNextPage } = useQnaSummary(
    courseId,
    5,
  );

  return (
    <div className={styles.section}>
      <h2>Q&A</h2>

      {loading && list.length === 0 && (
        <div className={styles.skeletonList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonItem} />
          ))}
        </div>
      )}

      {message && list.length === 0 && (
        <div className={styles.error}>{message}</div>
      )}

      {!loading && !message && list.length === 0 && (
        <div className={styles.empty}>등록된 Q&A가 없습니다.</div>
      )}

      <ul className={styles.qnaList}>
        {list.map((item) => (
          <li key={item.qnaId} className={styles.qnaItem}>
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

        {hasMore && (
          <li className={`${styles.qnaItem} ${styles.loadMoreItem}`}>
            <button
              type="button"
              onClick={fetchNextPage}
              disabled={loading}
              className={styles.loadMoreButton}
            >
              {loading ? "불러오는 중..." : "더보기"}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
