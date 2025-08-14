"use client";

import { CARDTYPE } from "@/types/card";
import { CourseCard } from "@/types/course";
import classNames from "classnames";
import Image from "next/image";
import styles from "./customCard.module.scss";

interface CardProps {
  data: CourseCard;
  type?: CARDTYPE; // 기본 = 세로 카드
  onClick?: () => void;
}

function diffDays(a: Date, b: Date) {
  const ms = a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function getStatus(data: CourseCard) {
  const now = new Date();
  const start = new Date(data.courseStartDate);
  const end = data.courseEndDate ? new Date(data.courseEndDate) : null;

  if (isNaN(start.getTime())) {
    return { key: "unknown", label: "일정 미정", dText: "" };
  }
  if (now < start) {
    const d = diffDays(start, now);
    return { key: "recruiting", label: "모집중", dText: `D-${d}` };
  }
  if (end && now <= end) {
    const d = diffDays(end, now);
    return { key: "ongoing", label: "진행중", dText: `종료 D-${d}` };
  }
  if (!end) {
    return { key: "ongoing", label: "진행중", dText: "" };
  }
  return { key: "ended", label: "종료", dText: "" };
}

export default function CustomCard({ data, type, onClick }: CardProps) {
  const percent = Math.max(0, Math.min(5, data.averageReviewScore)) * 20; // 0~100%
  const tags = (data.canLearns ?? []).slice(0, 6);
  const status = getStatus(data);

  return (
    <article
      className={classNames(styles.card, {
        [styles.horizontal as string]: type === CARDTYPE.HORIZONTAL,
        [styles.vertical as string]: !type || type === CARDTYPE.VERTICAL,
      })}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* 썸네일 */}
      <div className={styles.thumb}>
        <Image
          src={data?.responseFileInfo?.presignedUrl ?? "/images/404.jpg"}
          alt={data.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className={styles.image}
          priority={false}
        />
        {/* 상태 뱃지 */}
        <span
          className={classNames(styles.statusBadge, {
            [styles.recruiting as string]: status.key === "recruiting",
            [styles.ongoing as string]: status.key === "ongoing",
            [styles.ended as string]: status.key === "ended",
            [styles.unknown as string]: status.key === "unknown",
          })}
        >
          <strong>{status.label}</strong>
          {status.dText && <em className={styles.dText}>{status.dText}</em>}
        </span>
      </div>

      {/* 본문 */}
      <div className={styles.body}>
        {/* 제목 */}
        <h3 className={styles.title}>{data.title}</h3>

        {/* 메타 (강사명 • Live • 시청자수) */}
        <div className={styles.meta}>
          <span className={styles.instructor}>{data.instructorName}</span>
          <span className={styles.dot}>•</span>
          {data.isLive ? (
            <>
              <span className={styles.live}>Live</span>
              <span className={styles.dot}>•</span>
              <span className={styles.viewers}>
                {data.viewerCount?.toLocaleString() ?? 0}명 시청 중
              </span>
            </>
          ) : (
            <span className={styles.viewers}>
              {data.viewerCount?.toLocaleString() ?? 0}명 수강
            </span>
          )}
        </div>

        {/* 별점 */}
        <div className={styles.ratingRow}>
          <span className={styles.ratingLabel}>평균 별점</span>
          <div
            className={styles.stars}
            style={{ "--fill": `${percent}%` } as React.CSSProperties}
            aria-label={`평점 ${data.averageReviewScore} / 5`}
          >
            <span className={styles.a11y}>
              {data.averageReviewScore} out of 5
            </span>
          </div>
        </div>

        {/* 해시태그 */}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((t, i) => (
              <span key={i} className={styles.tag}>
                #{t.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
