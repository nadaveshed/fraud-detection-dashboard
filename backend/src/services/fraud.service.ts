import type { Transaction, FraudEvent, FraudType } from "../types/transaction";
import { distanceKm } from "../utils/haversine";

const HIGH_FREQUENCY_THRESHOLD = 6;
const HIGH_FREQUENCY_WINDOW_MS = 60 * 60 * 1000;
const DISTANT_KM_THRESHOLD = 500;
const DISTANT_TIME_WINDOW_MS = 90 * 60 * 1000;

function sortByTime(tx: Transaction[]): Transaction[] {
  return [...tx].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function detectHighFrequency(transactions: Transaction[]): FraudEvent[] {
  const byUser = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const list = byUser.get(t.user_id) ?? [];
    list.push(t);
    byUser.set(t.user_id, list);
  }
  const events: FraudEvent[] = [];
  const seenTxInHf = new Set<string>();
  for (const [, list] of byUser) {
    const sorted = sortByTime(list);
    for (let i = 0; i < sorted.length; i++) {
      const t = sorted[i]!;
      const tTime = new Date(t.timestamp).getTime();
      const inWindow = sorted.filter(
        (s) =>
          new Date(s.timestamp).getTime() >= tTime &&
          new Date(s.timestamp).getTime() <= tTime + HIGH_FREQUENCY_WINDOW_MS
      );
      if (inWindow.length >= HIGH_FREQUENCY_THRESHOLD) {
        inWindow.forEach((s) => {
          if (seenTxInHf.has(s.transaction_id)) return;
          seenTxInHf.add(s.transaction_id);
          events.push({
            transaction_id: s.transaction_id,
            user_id: s.user_id,
            timestamp: s.timestamp,
            fraud_type: "HIGH_FREQUENCY",
            amount: s.amount,
            country: s.country,
            description: `High frequency: ${inWindow.length} transactions in 1 hour`,
          });
        });
        break;
      }
    }
  }
  return events;
}

function detectDistantLocations(transactions: Transaction[]): FraudEvent[] {
  const byUser = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const list = byUser.get(t.user_id) ?? [];
    list.push(t);
    byUser.set(t.user_id, list);
  }
  const events: FraudEvent[] = [];
  for (const [, list] of byUser) {
    const sorted = sortByTime(list);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i]!;
        const b = sorted[j]!;
        const timeDiff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (timeDiff > DISTANT_TIME_WINDOW_MS) break;
        const km = distanceKm(a.location, b.location);
        if (km >= DISTANT_KM_THRESHOLD) {
          events.push(
            {
              transaction_id: a.transaction_id,
              user_id: a.user_id,
              timestamp: a.timestamp,
              fraud_type: "DISTANT_LOCATIONS",
              amount: a.amount,
              country: a.country,
              description: `Distant locations: ${Math.round(km)} km within ${Math.round(timeDiff / 60000)} min`,
            },
            {
              transaction_id: b.transaction_id,
              user_id: b.user_id,
              timestamp: b.timestamp,
              fraud_type: "DISTANT_LOCATIONS",
              amount: b.amount,
              country: b.country,
              description: `Distant locations: ${Math.round(km)} km within ${Math.round(timeDiff / 60000)} min`,
            }
          );
          break;
        }
      }
    }
  }
  return events;
}

function dedupeByTransaction(events: FraudEvent[]): FraudEvent[] {
  const seen = new Set<string>();
  return events.filter((e) => {
    const key = `${e.transaction_id}-${e.fraud_type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function runFraudDetection(transactions: Transaction[]): FraudEvent[] {
  const hf = detectHighFrequency(transactions);
  const dl = detectDistantLocations(transactions);
  return dedupeByTransaction([...hf, ...dl]);
}

export function summarizeFraud(events: FraudEvent[]): {
  total: number;
  byType: Record<FraudType, number>;
  events: FraudEvent[];
} {
  const byType: Record<FraudType, number> = {
    HIGH_FREQUENCY: 0,
    DISTANT_LOCATIONS: 0,
  };
  for (const e of events) {
    byType[e.fraud_type]++;
  }
  return { total: events.length, byType, events };
}
