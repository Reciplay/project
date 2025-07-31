"use client";

import ScrollTabs from "@/components/tab/scrollTabs";
import { useRef } from "react";
import Notices from "./__components/notices/notices";
import Overview from "./__components/overview/overview";
import QnA from "./__components/qna/qna";
import Review from "./__components/reviewPrompt/reviewPrompt";
import Reviews from "./__components/reviews/reviews";
import Schedule from "./__components/schedule/schedule";
import Status from "./__components/status/status";
import Summary from "./__components/summary/summary";

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
      <Summary />
      <Review />
      <Status />
      <ScrollTabs sectionRefs={sectionRefs} tabTitles={tabTitles} />
      <Overview ref={sectionRefs[0]} />
      <QnA ref={sectionRefs[1]} />
      <Notices ref={sectionRefs[2]} />
      <Schedule ref={sectionRefs[3]} />
      <Reviews ref={sectionRefs[4]} />
    </>
  );
}
