import styles from "./baseInput.module.scss";
import classNames from "classnames";

interface BaseInputProps {
  placeholder: string;
  type: string;
}

export default function BaseInput({ placeholder, type }: BaseInputProps) {
  const isCustom = type === "custom";

  return isCustom ? (
    <div className={styles.inputContainer}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      className={classNames(styles.input, styles[type])}
    />
  );
}
