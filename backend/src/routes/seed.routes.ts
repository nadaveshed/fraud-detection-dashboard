import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { seed } from "../controllers/seed.controller";

const router = Router();

router.get("/", asyncHandler(seed));

export default router;
