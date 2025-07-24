import styles from "./baseInput.module.scss";
import classNames from "classnames";

interface BaseInputProps {
  placeholder: string;
  type: string;
  value?: string; // ✅ 추가
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ 추가
}

export default function BaseInput({ placeholder, type, value, onChange }: BaseInputProps) {
  const isCustom = type === "custom";

  return isCustom ? (
    <div className={styles.inputContainer}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        value={value} // ✅ 전달
        onChange={onChange} // ✅ 전달
      />
    </div>
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      className={classNames(styles.input, styles[type])}
      value={value} // ✅ 전달
      onChange={onChange} // ✅ 전달
    />
  );
}
