"use client";

import CustomCard from "@/components/card/customCard";
import CustomGrid from "@/components/grid/customGrid/customGrid";
import { sampleCourseCards } from "@/config/sampleCourse";
import { useMainCourses } from "@/hooks/course/useMainCourses";
import NetflixGrid from "../../components/grid/netflixGrid/netflixGrid";
import SpecialCarousel from "./__components/specialCarousel/specialCarousel";
import styles from "./page.module.scss";

export default function Page() {
  const { specialCourses, soonCourses, enrolledCourses } = useMainCourses();

  console.log(specialCourses);
  return (
    <div className={styles.container}>
      <SpecialCarousel />

      <NetflixGrid
        title="수강중인 강좌"
        items={sampleCourseCards}
        gapRem={2} // 넷플릭스 그리드 아이템 간격
        renderItem={(course) => <CustomCard data={course} />}
      />

      <CustomGrid
        title="개설 예정 강좌 목록"
        items={sampleCourseCards}
        renderItem={(course) => <CustomCard data={course} />}
      />
    </div>
  );
}
