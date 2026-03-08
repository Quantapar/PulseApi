import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import { userRouter } from "./src/routes/userRouter";
import { endpointRouter } from "./src/routes/endpointRouter";

const app = express();

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"], 
  credentials: true, 
}));

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api", userRouter);
app.use("/api/endpoints", endpointRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
