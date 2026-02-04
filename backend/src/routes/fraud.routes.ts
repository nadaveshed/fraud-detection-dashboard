import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getFraudEvents } from "../controllers/fraud.controller";

const router = Router();

router.get("/", asyncHandler(getFraudEvents));

export default router;
