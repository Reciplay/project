"use client";

import styles from "./scrollTabs.module.scss";
import BaseButton from "@/components/button/baseButton";
import { RefObject } from "react";

interface ScrollTabsProps {
  sectionRefs: RefObject<HTMLDivElement | null>[];
  tabTitles: string[];
}

export default function ScrollTabs({
  sectionRefs,
  tabTitles,
}: ScrollTabsProps) {
  const handleScrollTo = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className={styles.tabContainer}>
      {tabTitles.map((title, idx) => (
        <BaseButton
          key={idx}
          variant="ghost"
          onClick={() => handleScrollTo(idx)}
          title={title}
        />
      ))}
    </div>
  );
}
