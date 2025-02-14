import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import referralRoutes from "./routes/referral.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Accredian Refer & Earn API",
    version: "1.0.0",
    endpoints: {
      referrals: "/api/referrals",
      health: "/health",
    },
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/referrals", referralRoutes);

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource does not exist",
    path: req.path
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});