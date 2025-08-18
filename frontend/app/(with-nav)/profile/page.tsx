"use client";

import RadarChart from "@/components/chart/radarChart";
import { useGetSixLevel } from "@/hooks/profile/useGetSixLevel";
import { useProfile } from "@/hooks/profile/useProfile";
import ProfileHeader from "./__components/profileHeader/profileHeader";
import ProfileInfo from "./__components/profileInfo/profileInfo";
import styles from "./page.module.scss";

export default function Page() {
  const { data, loading, error, ...rest } = useProfile();
  const { data: levels } = useGetSixLevel();

  console.log(data);
  if (loading) {
    return <div>프로필 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!data) {
    return <div>프로필 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>내 프로필</div>
      <div className={styles.content}>
        <ProfileHeader userData={data} {...rest} />
        <div className={styles.subContent}>
          <div className={styles.child}>
            <ProfileInfo userData={data} error={error} {...rest} />
          </div>
          <div className={styles.child}>
            {levels && levels.length > 0 ? (
              <RadarChart levels={levels} />
            ) : (
              <div className={styles.level}>수업을 듣고 역량을 올려주세요.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
