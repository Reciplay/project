"use client";

import { CourseDetail } from "@/types/course";
import Image from "next/image";
import styles from "./overview.module.scss";

interface OverviewProps {
  courseDetail: CourseDetail;
}

export default function Overview({ courseDetail }: OverviewProps) {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src={
          courseDetail.courseCoverFileInfo?.presignedUrl ?? "/images/404.jpg"
        }
        alt={courseDetail.title}
        width={1600} // 원본 가로 크기 (알고 있다면)
        height={900} // 원본 세로 크기 (알고 있다면)
        style={{
          maxWidth: "100%", // 화면보다 크면 줄어듦
          height: "auto", // 비율 유지
          display: "block",
          margin: "0 auto",
        }}
        priority
      />
    </div>
  );
}
