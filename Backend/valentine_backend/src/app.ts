import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import referralRoutes from "./routes/routes/referral";
import userRoutes from "./routes/routes/user";
import registerRoutes from "./routes/routes/register";
import openUserRoutes from "./routes/routes/openuser";
import { apiLimiter, pollingLimiter, strictLimiter } from "./middleware/middleware/rateLimiter";
import { errorHandler } from "./middleware/middleware/errorHandler";
import { validateEnv } from "./utils/utils/env";
import authRoutes from "./routes/auth";
import eventRoutes from "./routes/events";
import ticketRoutes from "./routes/tickets";

const app = express();

// Validate environment variables
validateEnv();

app.set("trust proxy", 1); // Trust first proxy (AWS ELB / Ngrok)

// Security Headers
app.use(helmet());

// Logging
app.use(morgan("dev"));

// CORS configuration - allow frontend origins
const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
    process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/", apiLimiter); // Apply general limit to all routes
app.use("/check-status", pollingLimiter); // Stricter limit for polling
app.use("/register", strictLimiter); // Strict limit for registration
app.use("/open-user", strictLimiter); // Strict limit for open registration
app.use("/submit-user", strictLimiter); // Strict limit for submission

// V1 Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/events", eventRoutes);
app.use("/v1/tickets", ticketRoutes);

// Legacy Routes
app.use("/", referralRoutes);
app.use("/", userRoutes);
app.use("/", registerRoutes);
app.use("/", openUserRoutes);

app.get("/", (req, res) => {
    res.send("Hello via Bun + Express! (Refactored)");
});

// Global Error Handler
app.use(errorHandler);

export default app;
