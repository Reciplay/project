import Image from "next/image";
import styles from "./sns.module.scss";

interface SNSProps {
  props: {
    isLogin: boolean;
  };
}

export default function SNS({ props }: SNSProps) {
  const text = props.isLogin ? "로그인" : "회원가입";

  return (
    <>
      <div className={styles.tagline}>SNS 계정으로 간편 {text}</div>
      <div className={styles.snsIcons}>
        {["apple", "google", "kakao"].map((provider) => (
          <a key={provider} href="#">
            <Image
              src={`/icons/${provider}.svg`}
              alt={provider}
              width={28}
              height={28}
            />
          </a>
        ))}
      </div>
    </>
  );
}
