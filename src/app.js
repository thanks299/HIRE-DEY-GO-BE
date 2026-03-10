import express from "express"
import errorMiddleware from "./middlewares/error.middleware.js"
import authRoute from "./modules/auth/auth.routes.js"
import jobRoute from "./modules/job/jobs.route.js"
import profileRoutes from "./modules/profile/profile.routes.js";
import applicationRoutes from "./modules/applications/application.routes.js";

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send("Hello and welcome to hire dey go")
})

app.use("/api/v1/auth", authRoute);
app.use("/api/v1", jobRoute);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", applicationRoutes);
app.use(errorMiddleware)

export default app

