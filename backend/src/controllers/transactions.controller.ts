import type { Request, Response } from "express";
import { getTransactionsInRange } from "../services/data.service";

export async function getTransactions(req: Request, res: Response): Promise<void> {
  const startDate = (req.query.startDate as string) ?? undefined;
  const endDate = (req.query.endDate as string) ?? undefined;
  const transactions = await getTransactionsInRange(startDate, endDate);
  res.json(transactions);
}
