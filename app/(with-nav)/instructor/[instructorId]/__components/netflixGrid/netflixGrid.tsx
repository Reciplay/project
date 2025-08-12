"use client";

import { ReactNode } from "react";
import styles from "./netflixGrid.module.scss";

interface netflixGridProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, idx: number) => ReactNode; // 각 타입별 렌더 함수
  onMore?: () => void; // 선택: 더보기
  max?: number; // 기본 5
}

export default function netflixGrid<T>({
  title,
  items,
  renderItem,
  onMore,
  max = 5,
}: netflixGridProps<T>) {
  const sliced = items.slice(0, max);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {onMore && (
          <button type="button" className={styles.more} onClick={onMore}>
            더보기
          </button>
        )}
      </header>

      <div className={styles.row}>
        {sliced.map((it, idx) => (
          <div className={styles.cell} key={idx}>
            {renderItem(it, idx)}
          </div>
        ))}
      </div>
    </section>
  );
}
