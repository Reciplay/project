import Image from "next/image";
import styles from "./profileHeader.module.scss";

interface ProfileHeaderProps {
  props: {
    profileUrl: string;
    name: string;
    nickname: string;
    job: string;
  };
}

export default function ProfileHeader({ props }: ProfileHeaderProps) {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: 'url("/images/profile.webp")' }}
    >
      <div className={styles.profileContainer}>
        <div className={styles.profileImageWrapper}>
          <Image
            src={props.profileUrl}
            alt="profile"
            fill
            className={styles.profileImage}
          />
        </div>
      </div>

      <div className={`${styles.textContainer} ${styles.glassBox}`}>
        <div className={styles.name}>{props.nickname}</div>
        <div className={styles.tags}>
          <span>#{props.name} </span>
          <span>#{props.job}</span>
        </div>
      </div>
    </div>
  );
}
