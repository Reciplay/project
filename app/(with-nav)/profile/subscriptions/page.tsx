"use client";

import EmptyState from "@/components/common/emptyState";
import { useSubscribedInstructors } from "@/hooks/profile/useSubscribedInstructors";
import { useRouter } from "next/navigation";
import SubscribeGrid from "./__components/subscribeGrid/subscribeGrid";
import styles from "./page.module.scss";

export default function Page() {
  const { instructors, loading, error } = useSubscribedInstructors();
  const router = useRouter();

  if (loading) {
    return <div className={styles.container}>강사 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.container}>오류: {error}</div>;
  }

  // ✅ 구독한 강사가 없을 때: 독려 카피 + CTA 버튼
  if (!instructors || instructors.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="아직 구독한 강사가 없어요"
          description="마음에 드는 강사를 구독하고 새 강좌/공지 소식을 빠르게 받아보세요!"
          primaryText="메인으로 이동"
          // secondaryText="강사 둘러보기"
          onPrimary={() => router.push("/")}
          // onSecondary={() => router.push("/search?tab=instructors")}
        />
      </div>
    );
  }

  // ✅ 구독한 강사가 있을 때: 기존 그리드 노출
  return (
    <div className={styles.container}>
      <SubscribeGrid instructors={instructors} type="구독 중인 목록" />
    </div>
  );
}
