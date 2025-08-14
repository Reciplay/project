"use client";

import { useQnaSummary } from "@/hooks/qna/useQnaSummary";
import styles from "./qna.module.scss";

export default function QnA({ courseId }: { courseId: string }) {
  const { list, loading, message, page, totalPages, setPage } = useQnaSummary(
    courseId,
    5,
  );

  //   return (
  //     <div className={styles.section}>
  //       <h2>Q&A</h2>

  //       {loading && list.length === 0 && (
  //         <div className={styles.skeletonList}>
  //           {Array.from({ length: 3 }).map((_, i) => (
  //             <div key={i} className={styles.skeletonItem} />
  //           ))}
  //         </div>
  //       )}

  //       {message && list.length === 0 && (
  //         <div className={styles.error}>{message}</div>
  //       )}

  //       {!loading && !message && list.length === 0 && (
  //         <div className={styles.empty}>등록된 Q&A가 없습니다.</div>
  //       )}

  //       <ul className={styles.qnaList}>
  //         {list.map((item) => (
  //           <li key={item.qnaId} className={styles.qnaItem}>
  //             <div className={styles.title}>{item.title}</div>
  //             <div className={styles.meta}>
  //               <span className={styles.nickname}>{item.questionerNickname}</span>
  //               <span className={styles.dot}>•</span>
  //               <time className={styles.date}>
  //                 {new Date(item.questionAt).toLocaleDateString("ko-KR")}
  //               </time>
  //               {item.isAnswered && (
  //                 <span className={styles.answered}>답변 완료</span>
  //               )}
  //             </div>
  //           </li>
  //         ))}

  //         {hasMore && (
  //           <li className={`${styles.qnaItem} ${styles.loadMoreItem}`}>
  //             <button
  //               type="button"
  //               onClick={fetchNextPage}
  //               disabled={loading}
  //               className={styles.loadMoreButton}
  //             >
  //               {loading ? "불러오는 중..." : "더보기"}
  //             </button>
  //           </li>
  //         )}
  //       </ul>
  //     </div>
  //   );
  // }
  return (
    <div className={styles.section}>
      <h2>Q&A</h2>

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
                className={`${styles.pageBtn} ${
                  page === pageNum ? styles.active : ""
                }`}
                disabled={loading}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
