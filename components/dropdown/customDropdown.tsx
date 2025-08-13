"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./customDropdown.module.scss";

export interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.selector} onClick={() => setOpen((prev) => !prev)}>
        {selected ? selected.label : "선택해주세요"}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.option} ${
                opt.value === value ? styles.selected : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
