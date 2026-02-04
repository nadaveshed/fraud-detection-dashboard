"use client";

/**
 * Frontend: fetches via useDashboardData (SWR). Date range via react-datepicker, chart via Chart.js.
 */
import { useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { FraudEvent, CountryFraudInsight } from "@/types/transaction";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DateRangePicker } from "./DateRangePicker";
import { TransactionsPerHourChart } from "./TransactionsPerHourChart";
import type { ChartPoint } from "./TransactionsChart";

const DEFAULT_START = "2025-10-17";
const DEFAULT_END = "2025-10-19";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function FraudTypeLabel(type: string) {
  switch (type) {
    case "HIGH_FREQUENCY":
      return "High frequency (same user)";
    case "DISTANT_LOCATIONS":
      return "Distant locations (same user)";
    default:
      return type;
  }
}

export function FraudDashboard() {
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);
  const [appliedStart, setAppliedStart] = useState(DEFAULT_START);
  const [appliedEnd, setAppliedEnd] = useState(DEFAULT_END);

  const { data, error, isLoading, isValidating } = useDashboardData(
    appliedStart,
    appliedEnd
  );

  const applyRange = () => {
    const start = startDate || DEFAULT_START;
    const end = endDate || DEFAULT_END;
    const normalizedEnd = end < start ? start : end;
    if (normalizedEnd !== end) setEndDate(start);
    if (appliedStart !== start || appliedEnd !== normalizedEnd) {
      setAppliedStart(start);
      setAppliedEnd(normalizedEnd);
    }
  };

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!data?.transactions?.length) return [];
    return data.transactions.map((t, i) => ({
      timestamp: new Date(t.timestamp).getTime(),
      index: i + 1,
      transaction_id: t.transaction_id,
      amount: t.amount,
      timeLabel: formatDate(t.timestamp),
    }));
  }, [data?.transactions]);

  const fraudSummary = data?.fraudSummary ?? null;
  const countryInsight = data?.countryInsight ?? null;

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        onApply={applyRange}
        isLoading={isValidating}
      />
      {data && isValidating && (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Updating in background…
        </span>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {isLoading && !data && <DashboardSkeleton />}

      {data && fraudSummary && (
        <>
          <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Transactions per hour
            </h2>
            <TransactionsPerHourChart
              data={chartData}
              startDate={appliedStart}
              endDate={appliedEnd}
            />
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Fraud events summary
            </h2>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              Total fraud events in period: <strong>{fraudSummary.total}</strong>
            </p>
            <div className="mb-4 flex gap-4 text-sm">
              <span className="rounded bg-amber-100 px-2 py-1 dark:bg-amber-900/30">
                HIGH_FREQUENCY: {fraudSummary.byType.HIGH_FREQUENCY}
              </span>
              <span className="rounded bg-rose-100 px-2 py-1 dark:bg-rose-900/30">
                DISTANT_LOCATIONS: {fraudSummary.byType.DISTANT_LOCATIONS}
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <ul className="flex flex-col gap-2">
                {fraudSummary.events.length === 0 ? (
                  <li className="text-zinc-500 dark:text-zinc-400">
                    No fraud events in this period.
                  </li>
                ) : (
                  fraudSummary.events.map((e: FraudEvent, i: number) => (
                    <li
                      key={`${e.transaction_id}-${e.fraud_type}-${i}`}
                      className="flex flex-col gap-1 rounded border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800/50"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-zinc-500">{e.transaction_id}</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {FraudTypeLabel(e.fraud_type)}
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {formatDate(e.timestamp)}
                        </span>
                        {e.country && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-600">
                            {e.country}
                          </span>
                        )}
                      </div>
                      {e.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          From mock data: {e.description}
                        </p>
                      )}
                      {e.amount != null && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Amount: {Number(e.amount).toFixed(2)}
                        </p>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>

          {countryInsight && (
            <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Which country has the most fraud suspicions?
              </h2>
              {countryInsight.insights.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-4">
                    {countryInsight.insights.slice(0, 5).map((row) => (
                      <div
                        key={row.country}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-600 dark:bg-zinc-800/50"
                      >
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {row.country}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {row.fraudCount} events ({row.percentage}%)
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Top country: <strong>{countryInsight.insights[0]?.country}</strong> with{" "}
                    {countryInsight.insights[0]?.fraudCount} fraud suspicions.
                  </p>
                </>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  No fraud in this period.
                </p>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
