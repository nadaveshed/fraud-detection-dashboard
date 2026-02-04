import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import apiRoutes from "./routes";
import { seedFromFile } from "./db/seed";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
  seedFromFile()
    .then(({ count }) => console.log(`DB ready (transactions: ${count})`))
    .catch((e) => console.warn("DB seed/connect:", (e as Error).message));
});
