import styles from "./baseInput.module.scss";
import classNames from "classnames";
import React from "react";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  type: string;
  error? : string;
}

export default function BaseInput({ className, error, placeholder, type, ...rest }: BaseInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={classNames(styles.input, className, error, styles[type])}
      {...rest}
    />
  );
}
