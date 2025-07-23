"use client";

import { useRef } from "react";
import styles from "./scrollTabs.module.scss";
import BaseButton from "@/components/button/baseButton";

export default function ScrollTabs() {
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const handleScrollTo = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabContainer}>
        {/* <BaseButton /> */}
        <button onClick={() => handleScrollTo(0)}>Tab 1</button>
        <button onClick={() => handleScrollTo(1)}>Tab 2</button>
        <button onClick={() => handleScrollTo(2)}>Tab 3</button>
        <button onClick={() => handleScrollTo(3)}>Tab 4</button>
      </div>

      <div className={styles.section} ref={sectionRefs[0]}>
        <h2>Section 1</h2>
        <p>내용...</p>
      </div>
      <div className={styles.section} ref={sectionRefs[1]}>
        <h2>Section 2</h2>
        <p>내용...</p>
      </div>
      <div className={styles.section} ref={sectionRefs[2]}>
        <h2>Section 3</h2>
        <p>내용...</p>
      </div>
      <div className={styles.section} ref={sectionRefs[3]}>
        <h2>Section 4</h2>
        <p>내용...</p>
      </div>
    </div>
  );
}
