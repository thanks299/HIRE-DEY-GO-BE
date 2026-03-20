import express from "express";
import cors from "cors";
import { FRONTEND_URL, CLIENT_URL } from "./config/env.js";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoute from "./modules/auth/auth.routes.js";
import jobRoute from "./modules/job/jobs.route.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import applicationRoutes from "./modules/applications/application.routes.js";
import assessmentRouter from "./modules/assessment/assessment.route.js";
import swaggerSpec from "./swagger.js";
import scoringRoute from "./modules/scoring/scoring.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";
import companyRoutes from "./modules/company/company.routes.js";
import bookmarkRoutes from "./modules/bookmarks/bookmark.routes.js";
import cvRoutes from "./modules/cv/cv.routes.js";

const app = express();

const allowedOrigins = [
  FRONTEND_URL,
  CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (Postman, server-to-server) with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Homepage
 *     summary: Homepage route
 *     description: Test route to make sure backend is running
 *     responses:
 *       200:
 *         description: Returns welcome message
 */
app.get("/", (req, res) => {
  res.status(200).send("Hello and welcome to hire dey go");
});

app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("BODY:", req.body);
  next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1", jobRoute);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", applicationRoutes);
app.use("/api/v1", scoringRoute);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/", adminRoutes);
app.use("/api/v1", assessmentRouter);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/cv", cvRoutes);
app.use(errorMiddleware);

export default app;
