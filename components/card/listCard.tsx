import { CourseCard } from "@/types/course";
import { IMAGETYPE } from "@/types/image";
import Image from "next/image";
import BaseButton from "../button/baseButton";
import ImageWrapper from "../image/imageWrapper";
import styles from "./listCard.module.scss";

export type CardVariant = "vertical" | "horizontal";

export interface CourseCardProps {
  data: CourseCard;
  variant?: CardVariant; // optional로 하고 기본값은 vertical
}

export default function Card({ data }: CourseCardProps) {
  const filledStars = Math.floor(data.averageReviewScore);
  const emptyStars = 5 - filledStars;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <ImageWrapper
          src="/images/cook2.jpg"
          alt={data.title}
          type={IMAGETYPE.HORIZONTAL_CARD}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            {data.summary.split("\n").map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
            <br />
            <span>난이도 {data.level}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <div className={styles.title}>
            <span className={styles.highlight}>{data.title}</span>
            <Image
              src="/icons/learning.svg"
              width={80}
              height={30}
              alt="learning"
            ></Image>
          </div>
          <div className={styles.meta}>
            <span className={styles.instructorName}>{data.instructorName}</span>
            <span> • </span>
            <span className={styles.live}>LIVE</span>
            <span> • </span>
            <span className={styles.viewerCount}>
              {data.viewerCount ?? 0} 명 시청 중
            </span>
          </div>
          <div className={styles.rating}>
            평균 별점 {"★".repeat(filledStars)}
            {"☆".repeat(emptyStars)}
          </div>
          <div className={styles.announcement}>{data.announcement}</div>
          <BaseButton
            title="찜"
            variant="custom"
            type="submit"
            color="black"
            size="sm"
            // className={style.wishButton}
          />
        </div>
      </div>
    </div>
  );
}
