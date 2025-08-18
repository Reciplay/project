"use client";

import CustomButton from "@/components/button/customButton";
import ScrollTabs from "@/components/tab/scrollTabs";
import { ScrollContainerContext } from "@/contexts/ScrollContainerContext";
import { useCourseInfo } from "@/hooks/course/useCourseInfo";
import { useGetLectures } from "@/hooks/course/useGetLectures";
import { useGetLevel } from "@/hooks/course/useGetLevel";
import { useGetLive } from "@/hooks/course/useGetLive";
import { useScrollTabs } from "@/hooks/useScrollTabs";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";
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

  const mainRef = useContext(ScrollContainerContext);

  const { activeIdx, handleScrollTo, sectionRefs } = useScrollTabs(
    tabTitles.length,
    { scrollContainerRef: mainRef },
  );
  const { handleEnroll, courseDetail, message, loading } =
    useCourseInfo(courseId);

  const { data: level } = useGetLevel(Number(courseId));
  const { data: lectures } = useGetLectures(Number(courseId));

  const { data: liveLecture } = useGetLive(Number(courseId));
  const router = useRouter();

  console.log(liveLecture);

  if (loading) return <div>로딩중…</div>;
  if (!courseDetail)
    return <div>{message ?? "강좌 정보를 불러오지 못했습니다."}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.category}>{courseDetail.category}</div>
        <Summary courseDetail={courseDetail} />
        <Review onClickReviewButton={() => handleScrollTo(4)} />
        <Status level={level * 100} />

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
            <Schedule lectures={lectures} />
          </section>

          <section ref={sectionRefs[2]} className={styles.section}>
            <Notices courseDetail={courseDetail} />
          </section>

          <section ref={sectionRefs[3]} className={styles.section}>
            <QnA courseId={courseId} />
          </section>

          <section ref={sectionRefs[4]} className={styles.section}>
            <Reviews courseId={courseId} courseDetail={courseDetail} />
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
          {liveLecture !== null ? (
            <CustomButton
              title="라이브 참여"
              onClick={() =>
                router.push(`/room/${courseId}/${String(liveLecture)}`)
              }
              size="md"
              variant="custom"
              color="blue"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
