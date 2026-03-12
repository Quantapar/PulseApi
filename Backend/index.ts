import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import { userRouter } from "./src/routes/userRouter";
import { endpointRouter } from "./src/routes/endpointRouter";
import { publicRouter } from "./src/routes/publicRouter";
import { startMonitoringService } from "./src/services/monitor";

const app = express();

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173", "https://pulseapi.quantapar.com"],
  credentials: true, 
}));

app.all(/^\/api\/auth(?:\/.*)?$/, (req, res) => {
  return toNodeHandler(auth)(req, res);
});

app.use(express.json());

app.use("/api", userRouter);
app.use("/api/endpoints", endpointRouter);
app.use("/api/public", publicRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  startMonitoringService();
});
