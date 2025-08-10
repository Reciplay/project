import { AUTH } from "@/config/const";
import Image from "next/image";
import styles from "./sns.module.scss";

interface SNSProps {
  props: {
    isLogin: boolean;
  };
}

export default function SNS({ props }: SNSProps) {
  const text = props.isLogin ? AUTH.LOGIN : AUTH.SIGNUP;

  return (
    <>
      <div className={styles.tagline}>
        {AUTH.SNS} {text}
      </div>
      <div className={styles.snsIcons}>
        {AUTH.BRAND.map((provider) => (
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
