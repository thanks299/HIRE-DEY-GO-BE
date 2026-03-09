import express from "express"
import errorMiddleware from "./middlewares/error.middleware.js"
import authRoute from "./modules/auth/auth.routes.js"
import jobRoute from "./modules/job/jobs.route.js"

const app = express()

app.use(express.json())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1", jobRoute)
app.use(errorMiddleware)

export default app