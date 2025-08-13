"use client";

import { useSubscribedInstructors } from "@/hooks/profile/useSubscribedInstructors";
import SubscribeGrid from "./__components/subscribeGrid/subscribeGrid";
import styles from "./page.module.scss";

export default function Page() {
  const { instructors, loading, error } = useSubscribedInstructors();

  if (loading) {
    return <div className={styles.container}>강사 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.container}>오류: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <SubscribeGrid instructors={instructors} type="구독 중인 목록" />
    </div>
  );
}
