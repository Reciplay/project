// components/AnimatedProgress.tsx
"use client";

import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressPieChart({ pathColor = "FFD700", value = 75 }) {
  const [progress, setProgress] = useState(0);
  const [displayedValue, setDisplayedValue] = useState(0);

  // 숫자와 원 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < value) return prev + 1;
        clearInterval(interval);
        return value;
      });
    }, 10);

    const numberInterval = setInterval(() => {
      setDisplayedValue((prev) => {
        if (prev < value) return prev + 1;
        clearInterval(numberInterval);
        return value;
      });
    }, 20);

    return () => {
      clearInterval(interval);
      clearInterval(numberInterval);
    };
  }, [value]);

  return (
    <div style={{ width: 160, height: 160 }}>
      <CircularProgressbarWithChildren
        value={progress}
        strokeWidth={10}
        styles={buildStyles({
          trailColor: "#ddd", // 회색 배경 원
          pathColor: pathColor, // 노란 진행 원
          strokeLinecap: "round",
        })}
      >
        <div style={{ fontSize: "28px", fontWeight: 700 }}>
          {displayedValue}%
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
}
