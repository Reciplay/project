import RatingStarsReadonly from "@/components/ratingStars/ratingStarsReadonly";
import styles from "./reviewCard.module.scss";

interface ReviewCardProps {
  id: number;
  nickname: string;
  createdAt: string;
  rating: number;
  content: string;
  likeCount: number;
}

export default function ReviewCard({
  id,
  nickname,
  createdAt,
  rating,
  content,
}: ReviewCardProps) {
  return (
    <div key={id} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <div className={styles.avatar} />
          <div>
            <div className={styles.nickname}>{nickname}</div>
            <div className={styles.date}>업로드날짜 {createdAt}</div>
          </div>
        </div>
      </div>

      <RatingStarsReadonly value={rating} />

      <div className={styles.content}>
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* <div className={styles.upButton}>
        <IconWithText iconName="thumb" title={likeCount.toString()} />
      </div> */}
    </div>
  );
}
