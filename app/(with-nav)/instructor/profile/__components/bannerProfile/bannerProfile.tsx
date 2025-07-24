import CircleAvatar from "@/components/image/circleAvatar";
import styles from "./bannerProfile.module.scss";
import BaseButton from "@/components/button/baseButton";

export default function BannerProfile() {
  return (
    <div className={styles.container}>
      <CircleAvatar src="/images/김도윤.webp" alt="강사" />
      <div className={styles.textBox}>
        <div className={styles.name}>셰프 에드워드 권</div>
        <div className={styles.job}>현) LAB24 셰프</div>
        <div className={styles.job}>엘리멘츠 한우 총괄 셰프</div>

        <BaseButton title="구독" variant="custom" size="sm" />
      </div>
    </div>
  );
}
