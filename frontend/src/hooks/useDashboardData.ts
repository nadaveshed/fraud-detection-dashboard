import useSWR from "swr";
import type { Transaction, FraudSummary, CountryFraudInsight } from "@/types/transaction";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface DashboardData {
  transactions: Transaction[];
  fraudSummary: FraudSummary;
  countryInsight: { insights: CountryFraudInsight[]; total: number };
}

async function fetchDashboardData(
  startDate: string,
  endDate: string
): Promise<DashboardData> {
  const start = `${startDate}T00:00:00.000Z`;
  const end = `${endDate}T23:59:59.999Z`;
  const q = `startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;

  const [txRes, fraudRes, insightRes] = await Promise.all([
    fetch(`${API_BASE}/api/transactions?${q}`),
    fetch(`${API_BASE}/api/fraud-events?${q}`),
    fetch(`${API_BASE}/api/insights/country-fraud?${q}`),
  ]);

  if (!txRes.ok) throw new Error("Failed to load transactions");
  if (!fraudRes.ok) throw new Error("Failed to load fraud events");
  if (!insightRes.ok) throw new Error("Failed to load insight");

  const [transactions, fraudSummary, countryInsight] = await Promise.all([
    txRes.json(),
    fraudRes.json(),
    insightRes.json(),
  ]);

  return { transactions, fraudSummary, countryInsight };
}

/** Caches by date range; revalidates in background. Same range = instant from cache. */
export function useDashboardData(startDate: string, endDate: string) {
  const key =
    startDate && endDate ? `dashboard-${startDate}-${endDate}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<DashboardData>(
    key,
    () => fetchDashboardData(startDate, endDate),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      keepPreviousData: true,
    }
  );

  return {
    data,
    error: error?.message ?? null,
    isLoading: isLoading && !data,
    isValidating,
    mutate,
  };
}
