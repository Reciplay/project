// "use client";

// import { useRef } from "react";
// import ScrollTabs from "../../../../components/tab/scrollTabs";
// import Notices from "./[courseId]/__components/notices/notices";
// import Overview from "./[courseId]/__components/overview/overview";
// import QnA from "./[courseId]/__components/qna/qna";
// import Review from "./[courseId]/__components/reviewPrompt/reviewPrompt";
// import Reviews from "./[courseId]/__components/reviews/reviews";
// import Schedule from "./[courseId]/__components/schedule/schedule";
// import Status from "./[courseId]/__components/status/status";
// import Summary from "./[courseId]/__components/summary/summary";
// import styles from "./page.module.scss";

// export default function Page() {
//   const sectionRefs = [
//     useRef<HTMLDivElement>(null),
//     useRef<HTMLDivElement>(null),
//     useRef<HTMLDivElement>(null),
//     useRef<HTMLDivElement>(null),
//     useRef<HTMLDivElement>(null),
//   ];

//   const tabTitles = ["강의상세", "Q&A", "공지사항", "강의 시간표", "리뷰"];
//   return (
//     <>
//       <div className={styles.page}>
//         <Summary />
//         <Review />
//         <Status />
//         <ScrollTabs sectionRefs={sectionRefs} tabTitles={tabTitles} />
//         <Overview ref={sectionRefs[0]} />
//         <QnA ref={sectionRefs[1]} />
//         <Notices ref={sectionRefs[2]} />
//         <Schedule ref={sectionRefs[3]} />
//         <Reviews ref={sectionRefs[4]} />
//       </div>
//     </>
//   );
// }
