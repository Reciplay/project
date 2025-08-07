"use client";

import RadarChart from "@/components/chart/radarChart";
import { sampleUser } from "@/config/sampleUser";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import ProfileHeader from "./__components/profileHeader/profileHeader";
import ProfileInfo from "./__components/profileInfo/profileInfo";
import styles from "./page.module.scss";

export default function Page() {
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await restClient.get<ApiResponse<User>>("/user/profile", {
          requireAuth: true,
        });
        setData(res.data.data);

        console.log(res.data.data);
      } catch (e) {
        console.error("프로필 불러오기 실패:", e);
        setData(sampleUser.data);
      }
    };

    fetchProfile();
  }, []);

  if (!data) {
    return <div>프로필 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>내 프로필</div>
      <div className={styles.content}>
        <ProfileHeader
          profileUrl={data.imgUrl}
          job={data.job}
          name={data.name}
          nickname={data.nickname}
        />

        <div className={styles.subContent}>
          <div className={styles.child}>
            <ProfileInfo
              name={data.name}
              job={data.job}
              email={data.email}
              birth={data.birthDate}
              gender={data.gender}
              onUpdate={(newData) =>
                setData((prev) => (prev ? { ...prev, ...newData } : prev))
              }
            />
          </div>
          <div className={styles.child}>
            <RadarChart />
          </div>
        </div>
      </div>
    </div>
  );
}
