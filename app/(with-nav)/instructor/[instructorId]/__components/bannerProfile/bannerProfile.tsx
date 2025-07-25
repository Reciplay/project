import CircleAvatar from "@/components/image/circleAvatar";
import styles from "./bannerProfile.module.scss";
import BaseButton from "@/components/button/baseButton";
import { sampleInstructors } from "@/config/sampleData";

interface BannerProfileProps {
  instructorThumbnail: string;
  // instructorId: string;
}

export interface Instructor {
  id: number;
  name: string;
  thumbnail: string;
  subscribers: number;
}
export default function BannerProfile({
  instructorThumbnail,
}: BannerProfileProps) {
  return (
    <div className={styles.container}>
      <CircleAvatar src={instructorThumbnail} alt="강사" />
      <div className={styles.textBox}>
        <div className={styles.name}>셰프 에드워드 권</div>
        <div className={styles.job}>현) LAB24 셰프</div>
        <div className={styles.job}>엘리멘츠 한우 총괄 셰프</div>

        <BaseButton title="구독" variant="custom" size="sm" />
      </div>
    </div>
  );
}
