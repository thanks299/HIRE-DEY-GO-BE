import express from "express"
import errorMiddleware from "./middlewares/error.middleware.js"
import jobRoute from "./routes/jobs.route.js"

const app = express()

app.use(express.json())

app.use("/api/v1", jobRoute)
app.use(errorMiddleware)

export default app