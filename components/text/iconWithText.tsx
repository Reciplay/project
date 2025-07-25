import Image from "next/image";
import styles from "./iconWithText.module.scss";

interface IconWithTextProps {
  iconName: string;
  title: string;
  left?: boolean;
  size?: number;
  onClick?: () => void;
  size?: "sm" | "md";
}

export default function IconWithText({
  iconName,
  title,
  left = true,
  size = 20,
  onClick,
}: IconWithTextProps) {
  if (left) {
    return (
      <div className={styles.container} onClick={onClick}>
        <Image
          src={`/icons/${iconName}.svg`}
          alt={iconName}
          width={size}
          height={size}
        />
        <div>{title}</div>
      </div>
    );
  }

  return (
    <div className={styles.container} onClick={onClick}>
      <div>{title}</div>
      <Image
        src={`/icons/${iconName}.svg`}
        alt={iconName}
        width={size}
        height={size}
      />
    </div>
  );
}
