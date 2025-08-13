"use client";

import Courses from "./__components/courses/courses";
import Instructors from "./__components/instructors/instructors";
import Members from "./__components/members/members";
import styles from "./page.module.scss";

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <Instructors />
      <Courses />
      <Members />
    </div>
  );
}
