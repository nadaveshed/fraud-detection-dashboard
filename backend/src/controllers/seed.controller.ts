import type { Request, Response } from "express";
import { seedFromFile } from "../db/seed";

export async function seed(req: Request, res: Response): Promise<void> {
  const { count } = await seedFromFile();
  res.json({ ok: true, count });
}
