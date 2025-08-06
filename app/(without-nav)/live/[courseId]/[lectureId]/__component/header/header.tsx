// components/header.tsx
"use client";

import { useInterval } from "@/hooks/useInterval";
import { useState } from "react";
import styles from "./header.module.scss";

interface HeaderProps {
  lectureName?: string; // 예: Live Cooking / 세션 제목
  courseName?: string; // 현재 강의 이름 (부제)
  startTime?: Date; // 수업 시작 시각, 없으면 지금부터 시작
  onLeave?: () => void; // 떠나기 버튼 콜백
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Header({
  lectureName = "짜파게티 맛있게 먹는법",
  courseName = "백종원의 한식가르치기",
  startTime = new Date(),
  onLeave,
}: HeaderProps) {
  const [elapsedSec, setElapsedSec] = useState(() => {
    return Math.floor((Date.now() - startTime.getTime()) / 1000);
  });

  useInterval(() => {
    setElapsedSec(Math.floor((Date.now() - startTime.getTime()) / 1000));
  }, 1000);

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.lecture}>{lectureName}</div>
      </div>
      {/* <div className={styles.center}>
        <div className={styles.timer}>{formatDuration(elapsedSec)}</div>
      </div> */}
      <div className={styles.right}>
        <button
          className={styles.leaveButton}
          onClick={() => {
            if (onLeave) onLeave();
            else console.log("Leave clicked");
          }}
          aria-label="Leave lecture"
        >
          떠나기
        </button>
      </div>
    </div>
  );
}
