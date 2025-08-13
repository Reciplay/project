"use client";

import { Gender } from "@/types/user";
import classNames from "classnames";
import { KeyboardEvent } from "react";
import styles from "./genderPicker.module.scss";

type Size = "sm" | "md" | "lg";

type GenderPickerProps = {
  value?: Gender | null; // 0 = 남자, 1 = 여자
  onChange?: (gender: Gender) => void;
  name?: string; // 폼 전송용 hidden input name (옵션)
  size?: Size; // 높이/폰트 프리셋
  fullWidth?: boolean; // 폭 100%
  className?: string;
  disabled?: boolean;
};

export default function GenderPicker({
  value,
  onChange,
  name,
  size = "md",
  fullWidth = true,
  className,
  disabled = false,
}: GenderPickerProps) {
  const isSelected = (v: Gender) => value === v;

  const handleSelect = (v: Gender) => {
    if (disabled) return;
    onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next: Gender = value === 0 ? 1 : 0;
      onChange?.(next);
    }
  };

  return (
    <>
      {/* 폼 전송 호환 (옵션) */}
      {name && value !== undefined && (
        <input type="hidden" name={name} value={String(value)} />
      )}

      <div
        role="radiogroup"
        aria-label="성별 선택"
        aria-disabled={disabled}
        className={classNames(
          styles.group,
          styles[size],
          { [styles.fullWidth as string]: fullWidth, [styles.disabled as string]: disabled },
          className,
        )}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <button
          type="button"
          role="radio"
          aria-checked={isSelected(0)}
          className={classNames(styles.option, {
            [styles.selected as string]: isSelected(0),
          })}
          onClick={() => handleSelect(0)}
          disabled={disabled}
        >
          남자
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={isSelected(1)}
          className={classNames(styles.option, {
            [styles.selected as string]: isSelected(1),
          })}
          onClick={() => handleSelect(1)}
          disabled={disabled}
        >
          여자
        </button>
      </div>
    </>
  );
}
