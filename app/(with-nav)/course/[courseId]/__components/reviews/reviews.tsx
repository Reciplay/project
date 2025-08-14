"use client";

import { useGetCourseReview } from "@/hooks/review/useGetCourseReview";
import { CourseDetail } from "@/types/course";
import { useCallback, useRef } from "react";
import ReviewCard from "../reviewCard/reviewCard";
import styles from "./reviews.module.scss";

interface ReviewsProps {
  courseId: string;
  courseDetail: CourseDetail;
}

export default function Reviews({ courseId, courseDetail }: ReviewsProps) {
  const { list, loading, message, hasMore, fetchNextPage } = useGetCourseReview(
    Number(courseId),
    5,
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const triggerRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting && hasMore) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchNextPage],
  );

  return (
    <div className={styles.section}>
      <h2>리뷰</h2>

      <div className={styles.total}>
        <div className={styles.avgNum}>{courseDetail.averageReviewScore}</div>
        <div>⭐⭐⭐⭐⭐</div>
        <div className={styles.reviewNum}>
          {courseDetail.reviewCount} 개의 수강평
        </div>
      </div>

      <div className={styles.reviewForm}>
        <textarea placeholder="수강평을 작성해 주세요" />
        <button type="button">등록</button>
      </div>

      {message && list.length === 0 && (
        <div className={styles.error}>{message}</div>
      )}

      <div className={styles.reviewList}>
        {list.map((review, index) => (
          <div key={review.reviewId}>
            <ReviewCard
              id={review.reviewId}
              nickname={review.nickname}
              createdAt={new Date(review.createdAt).toLocaleDateString("ko-KR")}
              rating={5}
              content={review.content}
              likeCount={review.likeCount}
            />
            {index !== list.length - 1 && <hr className={styles.divider} />}
          </div>
        ))}
      </div>

      {loading && <div className={styles.loading}>불러오는 중...</div>}
      {hasMore && !loading && <div ref={triggerRef} style={{ height: 1 }} />}
    </div>
  );
}
