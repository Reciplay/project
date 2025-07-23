import Image from "next/image";
import styles from "./iconWithText.module.scss";

interface IconWithTextProps {
  iconName: string;
  title: string;
  onClick?: () => void;
}

export default function IconWithText({ iconName, title, onClick }: IconWithTextProps) {
  return (
    <div className={styles.container} onClick={onClick}>
      <Image
        src={`/icons/${iconName}.svg`}
        alt={iconName}
        width={20}
        height={20}
      />
      <div>{title}</div>
    </div>
  );
}
