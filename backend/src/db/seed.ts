import { readFileSync } from "fs";
import { join } from "path";
import { getDb, getCollectionName, ensureIndexes } from "./connection";
import type { Transaction } from "../types/transaction";
import { getCountryFromCoords } from "../utils/country-from-coords";

function getDataPath(): string {
  const dataDir = process.env.DATA_PATH ?? join(process.cwd(), "..", "data");
  return join(dataDir, "mock_transactions.json");
}

export async function seedFromFile(): Promise<{ count: number }> {
  const db = await getDb();
  const col = db.collection<Transaction>(getCollectionName());

  const existing = await col.countDocuments();
  if (existing > 0) {
    await ensureIndexes();
    return { count: existing };
  }

  const path = getDataPath();
  const raw = readFileSync(path, "utf-8");
  const list = JSON.parse(raw) as Transaction[];

  const docs = list.map((t) => {
    const country = t.country ?? getCountryFromCoords(t.location.latitude, t.location.longitude);
    return { ...t, country };
  });

  await col.insertMany(docs);
  await ensureIndexes();
  return { count: docs.length };
}
