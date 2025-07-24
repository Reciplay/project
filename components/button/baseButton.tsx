import styles from "./baseButton.module.scss";
import classNames from "classnames";

interface BaseButtonProps {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  color?: "black" | "red" | "green" | "blue";
}

export default function BaseButton({
  title,
  type = "button",
  color = "black",
  ...rest
}: BaseButtonProps) {
  return (
    <button
      className={classNames(styles.container, color && styles[color])}
      type={type}
      {...rest}
    >
      {title}
    </button>
  );
}
