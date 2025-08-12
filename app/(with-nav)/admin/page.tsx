// app/admin/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
import Instructors from "./__components/instructors/instructors";
import Courses from "./__components/courses/courses";
import Members from "./__components/members/members";

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <Instructors />
      <Courses />
      <Members />
    </div>
  );
}
