"use client";

import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./customGrid.module.scss";

type CustomGridProps<T> = {
  title?: string;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** 최소 카드 너비(px, rem 등 단위 포함). 기본: 20rem */
  minItemWidth?: string;
  /** 아이템 간격 (CSS 단위 포함). 기본: 20px */
  gap?: string;
  className?: string;
};

export default function CustomGrid<T>({
  title,
  items,
  renderItem,
  minItemWidth = "20rem",
  gap = "20px",
  className,
}: CustomGridProps<T>) {
  return (
    <>
      <div className={styles.title}>{title}</div>
      <div
        className={classNames(styles.grid, className)}
        style={
          {
            // CSS 변수로 주입해서 SCSS의 grid-template에 연결
            "--min": minItemWidth,
            "--gap": gap,
          } as React.CSSProperties
        }
      >
        {items.map((it, i) => renderItem(it, i))}
      </div>
    </>
  );
}
