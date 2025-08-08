"use client";

import RadarChart from "@/components/chart/radarChart";
import { useProfile } from "@/hooks/profile/useProfile";
import ProfileHeader from "./__components/profileHeader/profileHeader";
import ProfileInfo from "./__components/profileInfo/profileInfo";
import styles from "./page.module.scss";

export default function Page() {
  const profile = useProfile(); // ✅ 한 번만 호출

  if (!profile.userData) {
    return <div>프로필 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>내 프로필</div>
      <div className={styles.content}>
        <ProfileHeader {...profile} />
        <div className={styles.subContent}>
          <div className={styles.child}>
            <ProfileInfo {...profile} />
          </div>
          <div className={styles.child}>
            <RadarChart />
          </div>
        </div>
      </div>
    </div>
  );
}
