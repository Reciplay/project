import { APP_INFO } from "@/config/const";
import styles from "./logoWithDesc.module.scss";

interface LogoWithDescProps {
  desc: string;
}

export default function LogoWithDesc({ desc }: LogoWithDescProps) {
  return (
    <>
      <div className={styles.logo}>{APP_INFO.NAME}</div>
      <div className={styles.tagline}>{desc}</div>
    </>
  );
}
