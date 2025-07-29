import Sliding from "@/app/(with-nav)/(main-full)/__components/sliding";
import { sampleCourse1, sampleCourse2 } from "@/config/sampleCourse";
import { forwardRef } from "react";
import styles from "./classes.module.scss";

const Classes = forwardRef<HTMLDivElement>((_, ref) => {
  // 임시 강좌 불러오기

  return (
    <div ref={ref}>
      <div className={styles.title}>진행 중인 강좌</div>
      <Sliding
        props={{
          section: "",
          items: sampleCourse1,
        }}
      />
      <div className={styles.title}>종료된 강좌</div>
      <Sliding
        props={{
          section: "",
          items: sampleCourse2,
        }}
      />
    </div>
  );
});

Classes.displayName = "Classes";
export default Classes;
