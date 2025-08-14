"use client";

import RatingStars from "@/components/ratingStars/ratingStars";
import RatingStarsReadonly from "@/components/ratingStars/ratingStarsReadonly";
import { useGetCourseReview } from "@/hooks/review/useGetCourseReview";
import { useRegisterCourseReview } from "@/hooks/review/useRegisterCourseReview";
import { CourseDetail } from "@/types/course";
import { useCallback, useRef, useState } from "react";
import ReviewCard from "../reviewCard/reviewCard";
import styles from "./reviews.module.scss";

interface ReviewsProps {
  courseId: string;
  courseDetail: CourseDetail;
}

export default function Reviews({ courseId, courseDetail }: ReviewsProps) {
  const { list, loading, message, hasMore, fetchNextPage, reload } =
    useGetCourseReview(Number(courseId), 5);

  const {
    loading: registerLoading,
    message: registerMessage,
    error: registerError,
    registerReview,
  } = useRegisterCourseReview();

  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");

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

  const handleRegisterReview = async () => {
    await registerReview({
      courseId: Number(courseId),
      stars,
      review: reviewText,
    });
    setStars(0);
    setReviewText("");
    reload();
  };

  return (
    <div className={styles.section}>
      <h2>리뷰</h2>

      <div className={styles.total}>
        <div className={styles.avgNum}>{courseDetail.averageReviewScore}</div>
        <RatingStarsReadonly value={courseDetail.averageReviewScore} />
        <div className={styles.reviewNum}>
          {courseDetail.reviewCount} 개의 수강평
        </div>
      </div>

      {courseDetail.isReviwed ? (
        <></>
      ) : (
        <div className={styles.reviewForm}>
          <RatingStars
            value={stars}
            onChange={setStars}
            disabled={registerLoading}
          />
          <textarea
            placeholder="수강평을 작성해 주세요"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            disabled={registerLoading}
          />
          <button
            type="button"
            onClick={handleRegisterReview}
            disabled={registerLoading}
          >
            {registerLoading ? "등록 중..." : "등록"}
          </button>
          {registerMessage && (
            <div className={styles.success}>{registerMessage}</div>
          )}
          {registerError && <div className={styles.error}>{registerError}</div>}
        </div>
      )}

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
