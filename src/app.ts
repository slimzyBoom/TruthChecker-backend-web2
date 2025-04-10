import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logger";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import claimRoutes from "./routes/verify.route";
import { connectDB } from "./config/db.config";

dotenv.config(); 
connectDB(); // Connect to the database

const app = express();
app.use(requestLogger); // Middleware to log requests
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/claims", claimRoutes);
app.use(errorHandler); // Middleware to handle errors
export default app;
