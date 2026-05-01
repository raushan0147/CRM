// server.js
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./config/database");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.set("trust proxy", 1);

// ─── Connect to MongoDB ────────────────────────────────────────────────
connectDB();

// ─── Global Middleware ─────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
const localOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];

const envOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...localOrigins, ...envOrigins])];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (
      process.env.ALLOW_VERCEL_PREVIEWS === "true" &&
      /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));

// ─── Import Routes ─────────────────────────────────────────────────────
const authRoutes   = require("./routes/Auth");
const adminRoutes  = require("./routes/AdminRoutes");
const leadRoutes   = require("./routes/LeadRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");

// ─── Mount Routes ──────────────────────────────────────────────────────
app.use("/api/v1/auth",       authRoutes);
app.use("/api/v1/superAdmin", adminRoutes);
app.use("/api/v1/leads",      leadRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// ─── Health Check ──────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Lead Management API is running",
    version: "1.0.0",
  });
});

// ─── Start Server ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
});
