import { forwardRef } from "react";
import ReviewCard from "../reviewCard/reviewCard";
import styles from "./reviews.module.scss";
export interface Review {
  id: number;
  nickname: string;
  createdAt: string;
  rating: number;
  content: string;
  likeCount: number;
}

export const reviews: Review[] = [
  {
    id: 1,
    nickname: "요리왕비룡",
    createdAt: "2024.06.01",
    rating: 5,
    content:
      "이탈리안 요리를 이렇게 쉽게 설명해주는 강의는 처음이에요! 덕분에 집에서 뇨끼 성공했습니다 😍",
    likeCount: 125,
  },
  {
    id: 2,
    nickname: "개발하는셰프",
    createdAt: "2024.06.03",
    rating: 4,
    content:
      "강사님의 설명이 친절해서 초보자도 따라하기 쉬워요. 다만 재료 구입 팁도 같이 있었으면 더 좋았을 것 같아요.",
    likeCount: 87,
  },
  {
    id: 3,
    nickname: "파스타중독자",
    createdAt: "2024.06.05",
    rating: 5,
    content:
      "와... 뇨끼 하나 들었을 뿐인데 진짜 양식 마스터가 된 기분입니다. 너무 좋은 강의 :) 감사합니다!!!",
    likeCount: 213,
  },
];

const Reviews = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className={styles.section} ref={ref}>
      <h2>리뷰</h2>
      <div className={styles.total}>
        <div className={styles.avgNum}>4.9</div>
        <div>⭐⭐⭐⭐⭐</div>
        <div className={styles.reviewNum}>30개의 수강평</div>
      </div>
      <div className={styles.reviewList}>
        {reviews.map((review, index) => (
          <div key={review.id}>
            <ReviewCard {...review} />
            {index !== reviews.length - 1 && <hr className={styles.divider} />}
          </div>
        ))}
      </div>
    </div>
  );
});

Reviews.displayName = "Reviews";
export default Reviews;
