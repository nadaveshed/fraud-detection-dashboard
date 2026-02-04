import type { Request, Response } from "express";
import { getCountryFraudInsight } from "../services/insight.service";

export async function getCountryFraud(req: Request, res: Response): Promise<void> {
  const startDate = (req.query.startDate as string) ?? undefined;
  const endDate = (req.query.endDate as string) ?? undefined;
  const result = await getCountryFraudInsight(startDate, endDate);
  res.json(result);
}
