"use client";

import CustomCard from "@/components/card/customCard";
import CustomGrid from "@/components/grid/customGrid/customGrid";
import { useEnrolledCourses } from "@/hooks/course/useEnrolledCourses";
import { useSoonCourses } from "@/hooks/course/useSoonCourses";
import { useSpecialCourses } from "@/hooks/course/useSpecialCourses";
import { useRouter } from "next/navigation";
import NetflixGrid from "../../components/grid/netflixGrid/netflixGrid";
import SpecialCarousel from "./__components/specialCarousel/specialCarousel";
import styles from "./page.module.scss";

export default function Page() {
  const { list: specialList, loading: specialLoading } = useSpecialCourses();

  const { list: soonList, loading: soonLoading } = useSoonCourses();

  const { list: enrolledList, loading: enrolledLoading } = useEnrolledCourses();

  const router = useRouter();

  return (
    <div className={styles.container}>
      <SpecialCarousel />

      <NetflixGrid
        title="수강중인 강좌"
        items={enrolledList}
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
        items={soonList}
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
