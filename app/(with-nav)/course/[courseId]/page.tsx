"use client";

import CustomButton from "@/components/button/customButton";
import ScrollTabs from "@/components/tab/scrollTabs";
import { useCourseInfo } from "@/hooks/course/useCourseInfo";
import { useScrollTabs } from "@/hooks/useScrollTabs";
import { useParams } from "next/navigation";
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
  const { courseId } = useParams<{ courseId: string }>();
  const tabTitles = ["강의상세", "강의 시간표", "공지사항", "Q&A", "리뷰"];
  const { activeIdx, handleScrollTo, sectionRefs } = useScrollTabs(
    tabTitles.length,
  );
  const { handleEnroll, handleZzim, courseDetail, message, loading } =
    useCourseInfo(courseId);

  if (loading) return <div>로딩중…</div>;
  if (!courseDetail)
    return <div>{message ?? "강좌 정보를 불러오지 못했습니다."}</div>;

  console.log(courseDetail);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.category}>{courseDetail.category}</div>
        <Summary courseDetail={courseDetail} />
        <Review />
        <Status />

        <div className={styles.tab}>
          <ScrollTabs
            tabTitles={tabTitles}
            activeIdx={activeIdx}
            onClickTab={handleScrollTo}
          />
        </div>

        <div className={styles.sections}>
          <section ref={sectionRefs[0]} className={styles.section}>
            <Overview courseDetail={courseDetail} />
          </section>

          <section ref={sectionRefs[1]} className={styles.section}>
            <Schedule courseDetail={courseDetail} />
          </section>

          <section ref={sectionRefs[2]} className={styles.section}>
            <Notices courseDetail={courseDetail} />
          </section>

          <section ref={sectionRefs[3]} className={styles.section}>
            <QnA courseId={courseId} />
          </section>

          <section ref={sectionRefs[4]} className={styles.section}>
            <Reviews />
          </section>
        </div>
      </div>

      <div className={styles.interaction}>
        <div className={styles.box}>
          <CustomButton
            title="수강 신청"
            onClick={handleEnroll}
            size="md"
            variant="custom"
            color="green"
          />
          <CustomButton
            title="찜하기"
            onClick={handleZzim}
            size="md"
            variant="custom"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}
