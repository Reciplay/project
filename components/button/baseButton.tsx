import styles from "./baseButton.module.scss";
import classNames from "classnames";

interface BaseButtonProps {
  title: string;
  color?: "black" | "red" | "green" | "blue";
  type: string;
  variant?: "default" | "custom" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function BaseButton({
  title,
  color = "black",
  variant = "default",
  size = "md",
  className,
  ...props
}: BaseButtonProps) {
  return (
    <div
      className={classNames(
        styles.container,
        styles[size],                 // sm, md, lg 크기
        styles[variant],              // default, custom, outline, ghost 스타일
        styles[color],                // black, red, green, blue 색상
        className
      )}
      {...props}
    >
      {title}
    </div>
  );
}
