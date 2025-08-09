"use client";

import BaseButton from "@/components/button/baseButton";
import ScrollTabs from "@/components/tab/scrollTabs";
import { useScrollTabs } from "@/hooks/useScrollTabs";
import Notices from "./__components/notices/notices";
import Overview from "./__components/overview/overview";
import QnA from "./__components/qna/qna";
import Review from "./__components/reviewPrompt/reviewPrompt";
import Reviews from "./__components/reviews/reviews";
import Schedule from "./__components/schedule/schedule";
import Status from "./__components/status/status";
import Summary from "./__components/summary/summary";
import styles from "./page.module.scss";

export default function Page() {
  const tabTitles = ["강의상세", "강의 시간표", "공지사항", "Q&A", "리뷰"];
  const { activeIdx, handleScrollTo, sectionRefs } = useScrollTabs(
    tabTitles.length
  );

  

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.category}>요리 / 양식</div>
        <Summary />
        <Review />
        <Status />
        <ScrollTabs
          tabTitles={tabTitles}
          activeIdx={activeIdx}
          onClickTab={handleScrollTo}
        />{" "}
        <section ref={sectionRefs[0]}>
          <Overview />
        </section>
        <section ref={sectionRefs[1]}>
          <QnA />
        </section>
        <section ref={sectionRefs[2]}>
          <Notices />
        </section>
        <section ref={sectionRefs[3]}>
          <Schedule />
        </section>
        <section ref={sectionRefs[4]}>
          <Reviews />
        </section>
      </div>
      <div className={styles.interaction}>
        <div className={styles.box}>
          <BaseButton title="강의 개설하기"></BaseButton>
        </div>
      </div>
    </div>
  );
}
