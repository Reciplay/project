import Image from "next/image";
import styles from "./iconWithText.module.scss";

interface IconWithTextProps {
  iconName: string;
  title: string;
  left?: boolean;
  size?: number;
  editable?: boolean;
  onChange?: (value: string) => void;
  onClick?: () => void;
}

export default function IconWithText({
  iconName,
  title,
  left = true,
  size = 20,
  editable = false,
  onChange,
  onClick,
}: IconWithTextProps) {
  const content = editable ? (
    <input
      type="text"
      className={styles.input}
      value={title}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ) : (
    <div className={styles.title}>{title}</div>
  );

  if (left) {
    return (
      <div className={styles.container} onClick={onClick}>
        <Image
          src={`/icons/${iconName}.svg`}
          alt={iconName}
          width={size}
          height={size}
        />
        {content}
      </div>
    );
  }

  return (
    <div className={styles.container} onClick={onClick}>
      {content}
      <Image
        src={`/icons/${iconName}.svg`}
        alt={iconName}
        width={size}
        height={size}
      />
    </div>
  );
}
