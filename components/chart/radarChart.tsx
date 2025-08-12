// components/RadarChart.tsx
"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Chart.js 모듈 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 차트 데이터
const data = {
  labels: ["한식", "중식", "일식", "양식", "분식", "기타"],
  datasets: [
    {
      label: "지언쌤 요리 실력",
      data: [80, 60, 75, 50, 95, 65],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(255, 99, 132, 1)",
    },
  ],
};

// 옵션
const options = {
  responsive: true,
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 100,
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
    },
  },
};

export default function RadarChart() {
  return <Radar data={data} options={options} />;
}
