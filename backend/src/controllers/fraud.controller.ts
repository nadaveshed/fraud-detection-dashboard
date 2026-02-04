import type { Request, Response } from "express";
import { getTransactionsInRange } from "../services/data.service";
import { runFraudDetection, summarizeFraud } from "../services/fraud.service";

export async function getFraudEvents(req: Request, res: Response): Promise<void> {
  const startDate = (req.query.startDate as string) ?? undefined;
  const endDate = (req.query.endDate as string) ?? undefined;
  const transactions = await getTransactionsInRange(startDate, endDate);
  const events = runFraudDetection(transactions);
  const summary = summarizeFraud(events);
  res.json(summary);
}
