import Star from "@/components/rate/star";
import IconWithText from "@/components/text/iconWithText";
import { CourseDetail } from "@/types/course";
import Image from "next/image";
import styles from "./summary.module.scss";

interface SummaryProps {
  courseDetail: CourseDetail;
}

export default function Summary({ courseDetail }: SummaryProps) {
  const thumb =
    courseDetail.thumbnailFileInfos
      ?.slice()
      .sort((a, b) => a.sequence - b.sequence)[0]?.presignedUrl ||
    courseDetail.courseCoverFileInfo?.presignedUrl ||
    "/images/default_thumbnail.jpg";

  const rating = Math.max(
    0,
    Math.min(5, Number(courseDetail.averageReviewScore ?? 0))
  );
  const ratingText = rating.toFixed(1);

  const reviewCount = courseDetail.reviewCount ?? 0;
  const maxEnroll = courseDetail.maxEnrollments ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.title}>{courseDetail.title}</div>
        <div className={styles.desc}>{courseDetail.description}</div>
        <div className={styles.rating}>
          <span className={styles.starWrap}>
            <Star value={rating} /> {ratingText}
          </span>
          <span className={styles.meta}>
            수강평 {reviewCount.toLocaleString()}개 · 정원{" "}
            {maxEnroll.toLocaleString()}명
          </span>
        </div>
        <div className={styles.author}>
          {/* CourseDetail에 instructorName이 없으면 추후 주입 */}
          <IconWithText iconName="user" title="김밀란" />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.imageWrapper}>
          <Image
            className={styles.thumbnail}
            src={thumb}
            fill
            alt={`${courseDetail.title} 썸네일`}
            sizes="(max-width: 768px) 100vw, 560px"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}
