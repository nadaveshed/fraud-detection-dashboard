"use client";

import "chart.js/auto";
import { Scatter } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

export interface ChartPoint {
  timestamp: number;
  index: number;
  transaction_id: string;
  amount: number;
  timeLabel: string;
}

interface TransactionsChartProps {
  data: ChartPoint[];
  /** Selected start date (YYYY-MM-DD) so the chart X-axis shows this range */
  startDate?: string;
  /** Selected end date (YYYY-MM-DD) so the chart X-axis shows this range */
  endDate?: string;
}

function dateStringToTimestamp(s: string, endOfDay: boolean): number {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  const date = new Date(y, m - 1, d);
  if (endOfDay) date.setHours(23, 59, 59, 999);
  return date.getTime();
}

export function TransactionsChart({ data, startDate, endDate }: TransactionsChartProps) {
  const chartData = {
    datasets: [
      {
        label: "Transactions",
        data: data.map((p) => ({ x: p.timestamp, y: p.index })),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgb(16, 185, 129)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const xMin = startDate ? dateStringToTimestamp(startDate, false) : undefined;
  const xMax = endDate ? dateStringToTimestamp(endDate, true) : undefined;
  // Force ticks at start/end so the chosen date range appears on the axis
  const xStep =
    xMin != null && xMax != null && xMax > xMin ? (xMax - xMin) / 4 : undefined;

  const options: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const p = data[ctx.dataIndex];
            if (!p) return "";
            return [
              p.transaction_id,
              p.timeLabel,
              `Amount: ${Number(p.amount).toFixed(2)}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        title: { display: true, text: "Date" },
        min: xMin,
        max: xMax,
        ticks: {
          stepSize: xStep,
          callback: (value, index, values) => {
            if (typeof value !== "number") return value;
            const label = new Date(value).toLocaleDateString();
            // Don’t repeat the same date under the graph
            const ticks = values as unknown as (number | { value?: number })[];
            const seen = ticks.slice(0, index).map((t) => {
              const v = typeof t === "number" ? t : t?.value;
              return new Date(typeof v === "number" ? v : 0).toLocaleDateString();
            });
            if (seen.includes(label)) return "";
            return label;
          },
        },
      },
      y: {
        type: "linear",
        title: { display: true, text: "transaction_id" },
        min: 0,
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (typeof value !== "number" || value < 1) return value === 0 ? "0" : "";
            const i = Math.round(value) - 1;
            const id = data[i]?.transaction_id;
            if (!id) return String(value);
            return id.length > 12 ? `${id.slice(0, 8)}…` : id;
          },
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Scatter data={chartData} options={options} />
    </div>
  );
}
