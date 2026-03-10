// > **HireDeyGo** — _Find your next opportunity. Hire your next star._
import express from "express";
import profileRoutes from "./routes/profile.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import jobRoute from "./routes/jobs.route.js"
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/v1/auth", authRoute)
app.use("/api/v1", jobRoute)
app.use(errorMiddleware)

export default app;
