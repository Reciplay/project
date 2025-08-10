// import Overview from "./__components/overview/overview";
// import QandAList from "./__components/q&alist/q&aList";
// import Schedule from "./__components/schedule/schedule";
// import Statistics from "./__components/statistics/statistics";
// import styles from "./page.module.scss";

// export default function Page() {
//   return (
//     <div>
//       <div className={styles.cardContainer}>
//         <div>
//           <Statistics />
//           <Overview />
//         </div>
//         <Schedule />
//       </div>
//       <QandAList />
//     </div>
//   );
// }
"use client";

import CalendarOnly from "@/components/calendar/calendarOnly";
import DailySmoothLineChart from "@/components/chart/lineChart";
import TableComponent from "@/components/table/table";
import Image from "next/image";
import styles from "./page.module.scss";

/* ----------------- dummy data ----------------- */
const chartData = [22, 28, 18, 24, 23, 40, 26, 31, 42, 45, 50, 46];

type ScheduleItem = { date: string; title: string; color: string };
const schedule: ScheduleItem[] = [
  {
    date: "8월 2일 (토)",
    title: "기본 칼질과 재료 손질 - 셰프의 기초",
    color: "#ff5d5d",
  },
  {
    date: "8월 6일 (수)",
    title: "한식의 기본: 불고기와 계란찜",
    color: "#2bd3e3",
  },
  {
    date: "8월 9일 (토)",
    title: "중식의 정석: 탕수육과 깐풍기",
    color: "#7a6eff",
  },
  {
    date: "8월 13일 (수)",
    title: "파스타의 모든 것: 알리오올리오",
    color: "#5cc488",
  },
  {
    date: "8월 16일 (토)",
    title: "리조또와 브루스케타 만들기",
    color: "#d46cff",
  },
  {
    date: "8월 20일 (수)",
    title: "고기 마스터 클래스: 스테이크 굽기",
    color: "#5db7ff",
  },
  {
    date: "8월 23일 (토)",
    title: "비프타르타르 & 로스트비프",
    color: "#ff8dd1",
  },
  {
    date: "8월 27일 (수)",
    title: "시그니처 요리 만들기 (종합 실습)",
    color: "#ff7b00",
  },
];

function MiniCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-index
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = new Intl.DateTimeFormat("ko-KR", { month: "long" }).format(
    now
  );

  return (
    <div className={styles.calendarCard}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{monthName}</span>
      </div>
      <div className={styles.daysHead}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className={styles.calGrid}>
        {cells.map((d, i) => {
          const isToday = d === now.getDate();
          return (
            <div
              key={i}
              className={`${styles.calCell} ${isToday ? styles.today : ""} ${
                i % 7 >= 5 ? styles.weekend : ""
              }`}
            >
              {d ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------- page ----------------- */
export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        {/* 왼쪽 컬럼: 통계 카드 + 프로필 카드 (stack) */}
        <div className={styles.leftStack}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>📈</span>
              <h3 className={styles.cardTitle}>구독자 추이</h3>
            </div>
            <DailySmoothLineChart />
          </div>

          <div className={styles.profileCard}>
            <div className={styles.profileInfo}>
              <div>
                <div className={styles.profileName}>애드워드 권</div>
                <div className={styles.profileSub}>엘리먼츠 한우 총괄 셰프</div>
              </div>

              <div className={styles.metrics}>
                <div className={styles.metricRow}>
                  <span>총 수강생 수</span>
                  <strong>200</strong>
                </div>
                <div className={styles.metricRow}>
                  <span>평균 별점</span>
                  <strong>4.5</strong>
                </div>
                <div className={styles.metricRow}>
                  <span>총 리뷰 수</span>
                  <strong>278</strong>
                </div>
                <div className={styles.metricRow}>
                  <span>구독자 수</span>
                  <strong>1029</strong>
                </div>
              </div>
            </div>

            <div className={styles.photoWrap}>
              <Image
                src="/images/profile.jpg"
                alt="profile"
                fill
                sizes="(max-width: 1200px) 240px, 320px"
                className={styles.photo}
                priority
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼: 캘린더 + 스케줄 */}
        <div className={styles.rightCol}>
          {/* <MiniCalendar /> */}

          <div className={styles.card}>
            {" "}
            <CalendarOnly />
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>🗓️</span>
              <h3 className={styles.cardTitle}>스케줄 표</h3>
            </div>
            <ul className={styles.scheduleList}>
              {schedule.map((s, i) => (
                <li key={i} className={styles.scheduleItem}>
                  <span
                    className={styles.dot}
                    style={{ background: s.color }}
                  />
                  <span className={styles.sDate}>{s.date}</span>
                  <span className={styles.sTitle}>{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 필요 시 하단 섹션들 추가: Q&A 리스트 등 */}
      {/* <QandAList /> */}
      <TableComponent />
    </div>
  );
}
