import styles from "./page.module.scss";
import ProfileHeader from "./__components/profileHeader/profileHeader";
import { User, UserResponse } from "@/types/user";
import ProfileInfo from "./__components/profileInfo/profileInfo";
import RadarChart from "@/components/chart/radarChart";
import axiosInstance from "@/config/axiosInstance";

const getProfile = async () => {
  try {
    const res: UserResponse = await axiosInstance.get("/api/v1/user/profile", {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return res.data;
  } catch (e) {
    console.error("프로필 불러오기 실패:", e);
    return null;
  }
};

export default async function Page() {
  const data = await getProfile();

  if (!data) {
    return <div>프로필 정보를 불러올 수 없습니다.</div>;
  }

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
