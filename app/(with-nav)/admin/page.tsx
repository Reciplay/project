// app/admin/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
import InstructorRegisterList from "./__components/instructorRegisterList/instructorRegisterList";
import CourseList from "./__components/courseList/courseList";
import MemberList from "./__components/memberList/memberList";

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <InstructorRegisterList />
      <CourseList />
      <MemberList />
    </div>
  );
}
