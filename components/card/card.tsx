import { Course } from "@/types/course";
import styles from "./card.module.scss";
import ImageWrapper from "../image/imageWrapper";
import classNames from "classnames";
import { CARDTYPE } from "@/types/card";
import { IMAGETYPE } from "@/types/image";

interface CardProps {
  data: Course;
  type: CARDTYPE;
}

export default function Card({ data, type }: CardProps) {
  const filledStars = Math.floor(data.ratingAvg);
  const emptyStars = 5 - filledStars;

  const isHorizontal = type === CARDTYPE.HORIZONTAL;

  return (
    <div className={classNames(styles.card, styles[type])}>
      <ImageWrapper
        src={data.thumbnail}
        alt={data.title}
        type={
          isHorizontal ? IMAGETYPE.HORIZONTAL_CARD : IMAGETYPE.VERTICAL_CARD
        }
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{data.title}</h3>
        <div className={styles.meta}>
          <span className={styles.instructor}>{data.instructorName}</span>
          <span className={styles.dot}>•</span>
          {data.isLive && <span className={styles.live}>Live</span>}
          <span className={styles.dot}>•</span>
          <span className={styles.viewer}>{data.viewerCount}명 시청 중</span>
        </div>
        <div className={styles.rating}>
          <span>평균 별점</span>
          {"★".repeat(filledStars)}
          {"☆".repeat(emptyStars)}
        </div>
      </div>
    </div>
  );
}
