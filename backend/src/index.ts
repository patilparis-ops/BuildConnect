import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import { sessionConfig } from "./config/session.js";
import { errorHandler } from "./middleware/error-handler.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import contractorRoutes from "./routes/contractor.routes.js";
import quotationRoutes from "./routes/quotation.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);
const FRONTEND_URLS = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = new Set(FRONTEND_URLS);

// ==================== Middleware ====================
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } } as any));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // In production, only allow explicit origins; in dev, allow no-origin (curl, Postman)
      if (!origin) return callback(null, process.env.NODE_ENV !== "production");
      if (ALLOWED_ORIGINS.has(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(session(sessionConfig));

// ==================== Routes ====================
app.get("/health", (_req, res) => {
  res.json({ status: "healthy", service: "BuildConnect API", version: "1.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contractors", contractorRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// ==================== Error Handling ====================
app.use(errorHandler);

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`\n  BuildConnect API running at http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/health\n`);
});

export default app;
