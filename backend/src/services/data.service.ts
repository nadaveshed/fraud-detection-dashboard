import { getDb, getCollectionName } from "../db/connection";
import type { Transaction } from "../types/transaction";

export async function getTransactionsInRange(
  startDate?: string,
  endDate?: string
): Promise<Transaction[]> {
  const db = await getDb();
  const col = db.collection<Transaction>(getCollectionName());

  const filter: Record<string, unknown> = {};
  if (startDate != null || endDate != null) {
    filter.timestamp = {};
    if (startDate != null) (filter.timestamp as Record<string, string>).$gte = startDate;
    if (endDate != null) (filter.timestamp as Record<string, string>).$lte = endDate;
  }

  const cursor = col
    .find(filter)
    .sort({ timestamp: 1 })
    .project<Transaction>({ _id: 0 });

  const list = await cursor.toArray();
  return list.map((doc) => {
    const { _id, ...t } = doc as Transaction & { _id?: unknown };
    return t as Transaction;
  });
}
