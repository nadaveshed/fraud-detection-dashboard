import { Router } from "express";
import transactionsRoutes from "./transactions.routes";
import fraudRoutes from "./fraud.routes";
import insightsRoutes from "./insights.routes";
import seedRoutes from "./seed.routes";

const router = Router();

router.use("/transactions", transactionsRoutes);
router.use("/fraud-events", fraudRoutes);
router.use("/insights", insightsRoutes);
router.use("/seed", seedRoutes);

export default router;
