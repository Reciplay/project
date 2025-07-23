import classNames from "classnames";
import styles from "./baseButton.module.scss";

type ButtonType = "button" | "submit" | "reset";

interface BaseButtonProps {
  title: string;
  color?: "black" | "red" | "green" | "blue";
  type?: ButtonType; // ✅ 수정
  variant?: "default" | "custom" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: VoidFunction;
}

export default function BaseButton({
  title,
  color = "black",
  variant = "default",
  size = "md",
  type = "button", // ✅ 기본값 설정
  className,
  onClick,
  ...props
}: BaseButtonProps) {
  return (
    <button
      type={type} // ✅ 여기 정확히 들어감
      className={classNames(
        styles.container,
        styles[size],
        styles[variant],
        styles[color],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {title}
    </button>
  );
}
