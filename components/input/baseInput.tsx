import styles from "./baseInput.module.scss";
import classNames from "classnames";
import React from "react";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  type: string;
  value?: string;
  error?: string;
  success?: string; // ✅ 추가
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ 추가
}

export default function BaseInput({
  placeholder,
  type,
  value,
  error,
  onChange,
}: BaseInputProps) {
  const isCustom = type === "custom";

  return isCustom ? (
    <div className={styles.inputContainer}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        value={value}
        onChange={onChange}
      />
    </div>
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      className={classNames(styles.input, error, styles[type])}
      value={value} // ✅ 전달
      onChange={onChange} // ✅ 전달
    />
  );
}
