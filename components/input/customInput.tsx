import styles from "./customInput.module.scss";
import classNames from "classnames";
import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  type: string;
  value?: string;
  error?: string;
  success?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomInput({
  placeholder,
  type,
  value,
  error,
  success,
  onChange,
  ...rest
}: CustomInputProps) {
  const isCustom = type === "custom";
  const showMessage = error || success;

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.hasError]: !!error,
        [styles.hasSuccess]: !!success,
      })}
    >
      {isCustom ? (
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder={placeholder}
            className={styles.input}
            value={value}
            onChange={onChange}
            {...rest}
          />
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={styles.input} // ✅ 타입별 스타일 제거
          value={value}
          onChange={onChange}
          {...rest}
        />
      )}

      {showMessage && (
        <div
          className={classNames(styles.message, {
            [styles.error]: !!error,
            [styles.success]: !!success,
          })}
        >
          {error || success}
        </div>
      )}
    </div>
  );
}
