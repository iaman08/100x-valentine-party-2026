
import express from "express";
import cors from "cors";
import referralRoutes from "./routes/referral";
import userRoutes from "./routes/user";
import registerRoutes from "./routes/register";

import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

// CORS configuration - allow frontend origins
const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
    // Add production domain here when deploying
  ],
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/", referralRoutes);
app.use("/", userRoutes);
app.use("/", registerRoutes);

app.get("/", (req, res) => {
  res.send("Hello via Bun + Express!");
});

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});