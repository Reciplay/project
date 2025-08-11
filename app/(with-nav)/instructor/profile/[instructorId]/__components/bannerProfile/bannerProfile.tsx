// import CircleAvatar from "@/components/image/circleAvatar";
import BaseButton from "@/components/button/baseButton";
import CircleAvatar from "@/components/image/circleAvatar";
import styles from "./bannerProfile.module.scss";

interface BannerProfileProps {
  props: {
    profile: string;
    name: string;
    jobDescription: string;
    companyName: string;
  };
}

export default function BannerProfile({ props }: BannerProfileProps) {
  return (
    <div className={styles.container}>
      {/* <ImageWrapper
        src={props.profile}
        alt="강사"
        type={IMAGETYPE.PROFILE}
        className={styles.circleAvatar}
      /> */}
      <CircleAvatar src={props.profile} alt="강사" />
      <div className={styles.textBox}>
        <div className={styles.name}>{props.name}</div>
        <div className={styles.job}>{props.jobDescription}</div>
        <div className={styles.job}>{props.companyName}</div>

        <BaseButton title="구독" variant="custom" size="sm" />
      </div>
    </div>
  );
}
