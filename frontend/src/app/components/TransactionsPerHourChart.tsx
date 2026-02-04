"use client";

import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { ChartPoint } from "./TransactionsChart";

const HOUR_LABELS = [
  "12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am",
  "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm",
  "8pm", "9pm", "10pm", "11pm",
];

interface TransactionsPerHourChartProps {
  data: ChartPoint[];
  /** When single day: show that day only. When range: aggregate all days by hour. */
  startDate?: string;
  endDate?: string;
}

/** Hour (0–23) in UTC so bar counts match API/mock data (e.g. 11am = 304, 12pm = 284). */
function getHourUTC(ts: number): number {
  return new Date(ts).getUTCHours();
}

/** YYYY-MM-DD in UTC for filtering by selected date range. */
function timestampToDateKeyUTC(ts: number): string {
  const d = new Date(ts);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function TransactionsPerHourChart({
  data,
  startDate,
  endDate,
}: TransactionsPerHourChartProps) {
  const isSingleDay = startDate && endDate && startDate === endDate;

  const countsByHour = Array.from({ length: 24 }, () => 0);

  for (const p of data) {
    const dateKey = timestampToDateKeyUTC(p.timestamp);
    if (startDate && endDate) {
      if (isSingleDay && dateKey !== startDate) continue;
      if (dateKey < startDate || dateKey > endDate) continue;
    }
    const hour = getHourUTC(p.timestamp);
    countsByHour[hour]++;
  }

  const chartData = {
    labels: HOUR_LABELS,
    datasets: [
      {
        label: "Transactions",
        data: countsByHour,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const count = ctx.raw as number;
            const hour = ctx.dataIndex;
            return `${HOUR_LABELS[hour]}: ${count} transactions`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Hour (UTC)" },
        ticks: { maxRotation: 45 },
      },
      y: {
        type: "linear",
        title: { display: true, text: "Count" },
        min: 0,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(Number(value)) ? value : ""),
        },
      },
    },
  };

  const subtitle = isSingleDay && startDate
    ? ` for ${new Date(startDate + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`
    : " (selected range, by hour)";

  return (
    <div>
      <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
        Transaction count per hour{subtitle}
      </p>
      <div className="h-64 w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
