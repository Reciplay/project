"use client";

import { useInstructorStore } from "@/stores/instructorStore";
import styles from "./introduction.module.scss";

export default function Introduction() {
  const { introduction, setIntroduction } = useInstructorStore();

  return (
    <div>
      <span className={styles.title}>소개말</span>
      <hr />
      <div className={styles.container}>
        <textarea
          placeholder="소개말을 작성해주세요."
          className={styles.textarea}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
      </div>
    </div>
  );
}
