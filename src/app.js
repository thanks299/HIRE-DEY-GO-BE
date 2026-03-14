import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoute from "./modules/auth/auth.routes.js";
import jobRoute from "./modules/job/jobs.route.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import applicationRoutes from "./modules/applications/application.routes.js";
import scoringRoute from "./modules/scoring/scoring.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));
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

app.use("/api/v1/auth", authRoute);
app.use("/api/v1", jobRoute);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", applicationRoutes);
app.use("/api/v1", scoringRoute);
app.use("/api/v1/", notificationRoutes);
app.use("/api/v1/", adminRoutes);
app.use(errorMiddleware);

export default app;