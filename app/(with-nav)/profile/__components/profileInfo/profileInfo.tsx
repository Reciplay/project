import styles from "./profileInfo.module.scss";

interface ProfileInfoProps {
  props: {
    name: string;
    job: string;
    email: string;
    birth: string;
    gender: number;
  };
}

export default function ProfileInfo({ props }: ProfileInfoProps) {
  const genderText = props.gender === 0 ? "여성" : "남성";

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.title}>이름</div>
        <div className={styles.value}>{props.name}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>직업</div>
        <div className={styles.value}>{props.job}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>이메일</div>
        <div className={styles.value}>{props.email}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>생년월일</div>
        <div className={styles.value}>{props.birth}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>성별</div>
        <div className={styles.value}>{genderText}</div>
      </div>
    </div>
  );
}
