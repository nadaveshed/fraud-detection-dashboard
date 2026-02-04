import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("Error:", err);
  const message = err.message ?? "Internal server error";
  res.status(500).json({ error: message });
}
