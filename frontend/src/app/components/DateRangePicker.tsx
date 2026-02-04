"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  onApply: () => void;
  isLoading?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

function toDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  if (y && m && d) {
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function toInputString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Allow picking a wide range of dates (e.g. mock data may span years)
const DEFAULT_MIN = new Date(2020, 0, 1);
const DEFAULT_MAX = new Date(2030, 11, 31);

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onApply,
  isLoading,
  minDate = DEFAULT_MIN,
  maxDate = DEFAULT_MAX,
}: DateRangePickerProps) {
  const start = toDate(startDate);
  const end = toDate(endDate);

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Start date
        </label>
        <DatePicker
          selected={start}
          onChange={(d) => (d ? onStartChange(toInputString(d)) : undefined)}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat="yyyy-MM-dd"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 w-[160px]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          End date
        </label>
        <DatePicker
          selected={end}
          onChange={(d) => (d ? onEndChange(toInputString(d)) : undefined)}
          minDate={start}
          maxDate={maxDate}
          dateFormat="yyyy-MM-dd"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 w-[160px]"
        />
      </div>
      <button
        type="button"
        onClick={onApply}
        disabled={isLoading}
        className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        {isLoading ? "Updating…" : "Apply"}
      </button>
    </div>
  );
}
