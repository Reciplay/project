"use client";

import { Level } from "@/types/user";
import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Radar } from "react-chartjs-2";

// Chart.js 모듈 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface RadarChartProps {
  levels: Level[];
  title?: string;
  max?: number;
}
export default function RadarChart({
  levels,
  title = "요리 실력 지표",
  max = 100,
}: RadarChartProps) {
  // 라벨/값 계산 (categoryId로 정렬해 안정적 순서 보장)
  const { labels, values, suggestedMax } = useMemo(() => {
    const sorted = [...levels].sort((a, b) => a.categoryId - b.categoryId);
    const lbls = sorted.map((i) => i.category);
    const vals = sorted.map((i) => i.level);

    const dataMax = Math.max(100, ...(vals.length ? vals : [0])); // 빈배열 보호 + 최소 100 스케일
    // 지정된 max가 있으면 사용, 없으면 20단위 올림
    const sugMax = typeof max === "number" ? max : Math.ceil(dataMax / 20) * 20;

    return { labels: lbls, values: vals, suggestedMax: sugMax };
  }, [levels, max]);

  const data: ChartData<"radar"> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255, 99, 132, 1)",
        },
      ],
    }),
    [labels, values, title],
  );

  const options: ChartOptions<"radar"> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax,
          ticks: {
            stepSize: 20,
            backdropColor: "transparent",
            color: "#333",
          },
          pointLabels: {
            color: "#333",
            font: { size: 14 },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          angleLines: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
    }),
    [suggestedMax],
  );

  // 데이터가 없을 때 가드
  if (!levels || levels.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#888" }}>
        데이터가 없습니다.
      </div>
    );
  }

  return <Radar data={data} options={options} />;
}
