// app/admin/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
import InstructorRegisterList from "./instructorRegisterList/instructorRegisterList";
import CourseList from "./courseList/courseList";
import MemberList from "./memberList/memberList";

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <InstructorRegisterList />
      <CourseList />
      <MemberList />
    </div>
  );
}
