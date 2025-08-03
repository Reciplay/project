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
  value?: string; // ✅ react-hook-form Controller 지원용
}

export default function IconWithText({
  iconName,
  title,
  left = true,
  size = 20,
  editable = false,
  onChange,
  onClick,
  value,
}: IconWithTextProps) {
  const content = editable ? (
    <input
      type="text"
      className={styles.input} // ✅ 기존 디자인 유지
      value={value !== undefined ? value : title} // ✅ form value가 없으면 title fallback
      onChange={(e) => onChange?.(e.target.value)}
    />
  ) : (
    <div className={styles.title}>{title}</div>
  );

  return (
    <div className={styles.container} onClick={onClick}>
      {left && (
        <Image
          src={`/icons/${iconName}.svg`}
          alt={iconName}
          width={size}
          height={size}
        />
      )}
      {content}
      {!left && (
        <Image
          src={`/icons/${iconName}.svg`}
          alt={iconName}
          width={size}
          height={size}
        />
      )}
    </div>
  );
}
