import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getTransactions } from "../controllers/transactions.controller";

const router = Router();

router.get("/", asyncHandler(getTransactions));

export default router;
