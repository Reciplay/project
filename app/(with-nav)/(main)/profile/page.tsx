import Image from "next/image";
import styles from "./page.module.scss";
import ProfileHeader from "./__components/profileHeader/profileHeader";
import { User } from "@/types/user";
import { sampleUser } from "@/config/sampleUser";
import ProfileInfo from "./__components/profileInfo/profileInfo";
import RadarChart from "@/components/chart/radarChart";

export default function page() {
  const data: User = sampleUser.data;
  return (
    <div className={styles.container}>
      <div className={styles.title}>내 프로필</div>
      <div className={styles.content}>
        <ProfileHeader
          props={{
            profileUrl: data.imgUrl,
            job: data.job,
            name: data.name,
            nickname: data.nickname,
          }}
        />

        <div className={styles.subContent}>
          <div className={styles.child}>
            <ProfileInfo
              props={{
                name: data.name,
                job: data.job,
                email: data.email,
                birth: data.birthDate,
                gender: data.gender,
              }}
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
