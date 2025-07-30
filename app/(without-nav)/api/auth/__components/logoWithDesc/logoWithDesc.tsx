import styles from "./logoWithDesc.module.scss";

interface LogoWIthDescProps {
  props: {
    desc: string;
  };
}

export default function LogoWIthDesc({ props }: LogoWIthDescProps) {
  return (
    <>
      <div className={styles.logo}>Reciplay</div>
      <div className={styles.tagline}>{props.desc}</div>
    </>
  );
}
