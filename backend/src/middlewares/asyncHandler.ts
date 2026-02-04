import type { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

/** Wraps async route handlers so Express catches rejected promises. */
export function asyncHandler(fn: AsyncRequestHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}
