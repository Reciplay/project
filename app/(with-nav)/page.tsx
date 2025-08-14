"use client";

import CustomCard from "@/components/card/customCard";
import CustomGrid from "@/components/grid/customGrid/customGrid";
import NetflixGrid from "@/components/grid/netflixGrid/netflixGrid";
import { useCourseCards } from "@/hooks/course/useCourseCards";
import { useRouter } from "next/navigation";
import SpecialCarousel from "./__components/specialCarousel/specialCarousel";
import styles from "./page.module.scss";

export default function Page() {
  const { list: soonsoon } = useCourseCards({
    initialCondition: { requestCategory: "soon" },
    size: 20, // 한 번에 불러올 개수
    requireAuth: true,
    // sort: ["createdAt,desc"], // 정렬 옵션
  });

  const { list: enrolled } = useCourseCards({
    initialCondition: { requestCategory: "enrolled" },
    size: 20, // 한 번에 불러올 개수
    requireAuth: true,
  });

  const router = useRouter();

  return (
    <div className={styles.container}>
      <SpecialCarousel />

      <NetflixGrid
        title="수강중인 강좌"
        items={enrolled}
        gapRem={2} // 넷플릭스 그리드 아이템 간격
        renderItem={(course) => (
          <CustomCard
            data={course}
            key={course.courseId}
            onClick={() => router.push(`/course/${course.courseId}`)}
          />
        )}
      />

      <CustomGrid
        title="개설 예정 강좌 목록"
        items={soonsoon}
        renderItem={(course) => (
          <CustomCard
            data={course}
            key={course.courseId}
            onClick={() => router.push(`/course/${course.courseId}`)}
          />
        )}
      />
    </div>
  );
}
