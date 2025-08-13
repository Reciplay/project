"use client";

import RadarChart from "@/components/chart/radarChart";
import { useProfile } from "@/hooks/profile/useProfile";
import { Level } from "@/types/user";
import ProfileHeader from "./__components/profileHeader/profileHeader";
import ProfileInfo from "./__components/profileInfo/profileInfo";
import styles from "./page.module.scss";

const sampleLevels: Level[] = [
  { category: "한식", categoryId: 1, level: 80 },
  { category: "중식", categoryId: 2, level: 60 },
  { category: "일식", categoryId: 3, level: 75 },
  { category: "양식", categoryId: 4, level: 50 },
  { category: "분식", categoryId: 5, level: 95 },
  { category: "기타", categoryId: 6, level: 65 },
];

export default function Page() {
  const { userData, loading, error, ...rest } = useProfile();

  if (loading) {
    return <div>프로필 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!userData) {
    return <div>프로필 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>내 프로필</div>
      <div className={styles.content}>
        <ProfileHeader userData={userData} {...rest} />
        <div className={styles.subContent}>
          <div className={styles.child}>
            <ProfileInfo userData={userData} error={error} {...rest} />
          </div>
          <div className={styles.child}>
            <RadarChart levels={sampleLevels} />
            {/* <RadarChart levels={userData.levels ?? sampleLevels} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
