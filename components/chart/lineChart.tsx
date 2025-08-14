"use client";

import {
  Chart as ChartJS,
  Filler,
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
import { SubscriptionPoint } from "@/types/instructorStats";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface SmoothLineChartProps {
  data: SubscriptionPoint[];
  timeUnit: "day" | "month" | "year";
}

export default function SmoothLineChart({
  data: trendData,
  timeUnit,
}: SmoothLineChartProps) {
  const chartData = {
    datasets: [
      {
        label: "구독자 추이",
        data: trendData.map((point) => ({
          x: point.date,
          y: point.subscriber,
        })),
        fill: true,
        borderColor: "#2a73ff",
        backgroundColor: "rgba(42,115,255,0.2)",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const timeFormats = {
    day: "MM월 dd일",
    month: "yyyy년 MM월",
    year: "yyyy년",
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeUnit,
          tooltipFormat: timeFormats[timeUnit],
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
