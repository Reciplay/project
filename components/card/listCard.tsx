import styles from "./card.module.scss";
import listStyles from "./listCard.module.scss";
import ImageWrapper from "../image/imageWrapper";
import { IMAGETYPE } from "@/types/image";
import BaseButton from "../button/baseButton";
import { Course } from "@/types/course";

export type CardVariant = "vertical" | "horizontal";

export interface CourseCardProps {
  data: Course;
  variant?: CardVariant; // optional로 하고 기본값은 vertical
}

export default function Card({ data, variant = "vertical" }: CourseCardProps) {
  const filledStars = Math.floor(data.ratingAvg);
  const emptyStars = 5 - filledStars;

  const isHorizontal = variant === "horizontal";
  const style = isHorizontal ? listStyles : styles;

  return (
    <div className={style.card}>
      <div className={style.imageWrapper}>
        <ImageWrapper
          src={data.thumbnail}
          alt={data.title}
          type={
            isHorizontal ? IMAGETYPE.HORIZONTAL_CARD : IMAGETYPE.VERTICAL_CARD
          }
          className={style.image}
        />
        {isHorizontal && (
          <div className={style.overlay}>
            <div className={style.overlayText}>
              {data.summary.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
              <br />
              <span>{data.difficulty}자 시청 추천</span>
            </div>
          </div>
        )}
      </div>

      <div className={style.content}>
        <div className={style.title}>
          <span className={style.highlight}>{data.title}</span>
        </div>
        <div className={style.meta}>
          {data.instructorName} • {data.isLive && "Live"} • {data.viewerCount}명
          시청 중
        </div>
        <div className={style.rating}>
          평균 별점 {"★".repeat(filledStars)}
          {"☆".repeat(emptyStars)}
        </div>
        {isHorizontal && (
          <BaseButton
            title="찜"
            variant="custom"
            type="submit"
            color="black"
            size="sm"
            className={style.wishButton}
          />
        )}
      </div>
    </div>
  );
}
