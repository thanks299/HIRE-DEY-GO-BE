// > **HireDeyGo** — _Find your next opportunity. Hire your next star._
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import profileRoutes from "./routes/profile.routes.js";
import applicationRoutes from "./routes/application.routes.js";

dotenv.config();

const app = express();
// connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});