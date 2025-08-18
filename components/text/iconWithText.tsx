import Image from "next/image";
import styles from "./iconWithText.module.scss";

interface IconWithTextProps {
  iconName: string;
  title: string;
  left?: boolean;
  size?: number;
  editable?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // 수정
  value?: string;
}

export default function IconWithText({
  iconName,
  title,
  left = true,
  size = 20,
  editable = false,
  placeholder = "",
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
      placeholder={placeholder}
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
