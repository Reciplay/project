import styles from "./logoWithDesc.module.scss";

interface LogoWIthDescProps {
  desc: string;
}

export default function LogoWIthDesc({ desc }: LogoWIthDescProps) {
  return (
    <>
      <div className={styles.logo}>Reciplay</div>
      <div className={styles.tagline}>{desc}</div>
    </>
  );
}
