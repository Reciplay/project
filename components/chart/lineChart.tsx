"use client";

import {
  Chart as ChartJS,
  Filler, // 'time' 스케일
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { ko } from "date-fns/locale";
import { Line } from "react-chartjs-2";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

export default function DailySmoothLineChart() {
  const data = {
    datasets: [
      {
        label: "구독자 추이",
        data: [
          { x: "2025-08-01", y: 12 },
          { x: "2025-08-02", y: 19 },
          { x: "2025-08-03", y: 8 },
          { x: "2025-08-04", y: 15 },
          { x: "2025-08-05", y: 14 },
          { x: "2025-08-06", y: 25 },
          { x: "2025-08-07", y: 18 },
        ],
        fill: true,
        borderColor: "#2a73ff",
        backgroundColor: "rgba(42,115,255,0.2)",
        tension: 0.4, // 부드러운 선
        pointRadius: 0, // 점 숨김
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        type: "time", // ← 리터럴
        time: {
          unit: "day", // ← 리터럴
          tooltipFormat: "MM월 dd일",
        },
        adapters: { date: { locale: ko } },
        grid: { display: false },
      },
      y: {
        grid: { color: "#eee" },
      },
    },
  };

  return <Line data={data} options={options} />;
}
