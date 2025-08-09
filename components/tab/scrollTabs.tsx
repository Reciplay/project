"use client";
import classNames from "classnames";
import styles from "./scrollTabs.module.scss";

interface ScrollTabsProps {
  tabTitles: string[];
  activeIdx: number;
  onClickTab: (index: number) => void;
}

export default function ScrollTabs({
  tabTitles,
  activeIdx,
  onClickTab,
}: ScrollTabsProps) {
  return (
    <div className={styles.tabContainer}>
      {tabTitles.map((title, idx) => (
        <button
          key={title}
          type="button"
          className={classNames(styles.tab, {
            [styles.active]: activeIdx === idx,
          })}
          onClick={() => onClickTab(idx)}
        >
          {title}
          <span className={styles.underline} />
        </button>
      ))}
    </div>
  );
}
