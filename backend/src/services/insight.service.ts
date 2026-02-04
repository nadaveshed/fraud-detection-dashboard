import type { CountryFraudInsight, CountryFraudInsightResponse } from "../types/transaction";
import { getTransactionsInRange } from "./data.service";
import { runFraudDetection } from "./fraud.service";

export async function getCountryFraudInsight(
  startDate?: string,
  endDate?: string
): Promise<CountryFraudInsightResponse> {
  const transactions = await getTransactionsInRange(startDate, endDate);
  const events = runFraudDetection(transactions);
  const byCountry = new Map<string, number>();
  for (const e of events) {
    const country = e.country ?? "Unknown";
    byCountry.set(country, (byCountry.get(country) ?? 0) + 1);
  }
  const total = events.length;
  const insights: CountryFraudInsight[] = Array.from(byCountry.entries())
    .map(([country, fraudCount]) => ({
      country,
      fraudCount,
      percentage: total > 0 ? Math.round((fraudCount / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.fraudCount - a.fraudCount);
  return { insights, total };
}
