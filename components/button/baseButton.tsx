import styles from "./baseButton.module.scss";
import classNames from "classnames";

interface BaseButtonProps {
  title: string;
  color?: "black" | "red" | "green" | "blue";
  type: string;
}

export default function BaseButton({
  title,
  color = "black",
}: BaseButtonProps) {
  return (
    <div className={classNames(styles.container, color && styles[color])}>
      {title}
    </div>
  );
}
