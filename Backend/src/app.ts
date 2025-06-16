import cors from "cors";
import express from "express";
import { envConfig } from "./shared/config";
import { connectDB } from "./database";
import { errorHandler } from "./middleware";
import { carRoutes } from "./routes";

// Connect DB
connectDB();
// APP init
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/car", carRoutes);

app.use(errorHandler);

export default app;
