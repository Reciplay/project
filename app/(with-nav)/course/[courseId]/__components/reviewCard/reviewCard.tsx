import IconWithText from "@/components/text/iconWithText";
import styles from "./reviewCard.module.scss";

interface ReviewCardProps {
  nickname: string;
  createdAt: string;
  rating: number;
  content: string;
  likeCount: number;
}

export default function ReviewCard({
  nickname,
  createdAt,
  rating,
  content,
  likeCount,
}: ReviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <div className={styles.avatar} />
          <div>
            <div className={styles.nickname}>{nickname}</div>
            <div className={styles.date}>업로드날짜 {createdAt}</div>
          </div>
        </div>
      </div>

      <div className={styles.stars}>
        ⭐⭐⭐⭐⭐
        <span>{rating}</span>
      </div>

      <div className={styles.content}>
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className={styles.upButton}>
        <IconWithText iconName="thumb" title={likeCount.toString()} />
      </div>
    </div>
  );
}
