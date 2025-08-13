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
import { SubscriptionPoint } from "@/types/instructorStats"; // Import SubscriptionPoint

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface DailySmoothLineChartProps {
  data: SubscriptionPoint[]; // Accept data as prop
}

export default function DailySmoothLineChart({ data: trendData }: DailySmoothLineChartProps) { // Destructure data prop
  const chartData = {
    datasets: [
      {
        label: "구독자 추이",
        data: trendData.map(point => ({ x: point.date, y: point.subscriber })),
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

  return <Line data={chartData} options={options} />;
}