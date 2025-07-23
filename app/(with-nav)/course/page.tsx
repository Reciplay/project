"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "./page.module.scss";
import IconWithText from "@/components/text/iconWithText";
import BaseButton from "@/components/button/baseButton";
import ProgressPieChart from "@/components/chart/progressPieChart";
import ScrollTabs from "./scrollTabs";
import Summary from "./__components/summary";
import Review from "./__components/reviewPrompt";
import Status from "./__components/status";
import Overview from "./__components/overview";
import QnA from "./__components/qna";
import Notices from "./__components/notices";
import Schedule from "./__components/schedule";
import Reviews from "./__components/reviews";

export default function Page() {
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const tabTitles = ["강의상세", "Q&A", "공지사항", "강의 시간표", "리뷰"];
  return (
    <>
      <div className={styles.page}>
        <Summary />
        <Review />
        <Status />
        <ScrollTabs sectionRefs={sectionRefs} tabTitles={tabTitles} />
        <Overview ref={sectionRefs[0]} />
        <QnA ref={sectionRefs[1]} />
        <Notices ref={sectionRefs[2]} />
        <Schedule ref={sectionRefs[3]} />
        <Reviews ref={sectionRefs[4]} />
      </div>
    </>
  );
}
