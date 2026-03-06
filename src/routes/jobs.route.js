import { Router } from "express";
import { createJob, getJob, getJobs } from "../controllers/jobs.controller.js";

const jobRoute = Router();

jobRoute.get("/jobs", getJobs)
jobRoute.get("/jobs/:id", getJob)
jobRoute.post("/jobs", createJob)
// jobRoute.put("/jobs/:id")
// jobRoute.delete("/jobs/:id")
// jobRoute.patch("/jobs/:id/close")

export default jobRoute