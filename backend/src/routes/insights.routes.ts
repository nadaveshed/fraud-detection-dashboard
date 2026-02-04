import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getCountryFraud } from "../controllers/insights.controller";

const router = Router();

router.get("/country-fraud", asyncHandler(getCountryFraud));

export default router;
