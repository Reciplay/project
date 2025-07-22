import styles from "./baseInput.module.scss";
import classNames from "classnames";

interface BaseInputProps {
  placeholder: string;
  type: string;
}

export default function BaseInput({ placeholder, type }: BaseInputProps) {
  return (
    <input type={type} placeholder={placeholder} className={styles.input} />
  );
}
