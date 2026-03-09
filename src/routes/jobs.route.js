import { Router } from "express";
import { closeJobPosting, createJob, deleteJob, getJob, getJobs, updateJob } from "../controllers/jobs.controller.js";

const jobRoute = Router();

jobRoute.get("/jobs", getJobs)
jobRoute.get("/jobs/:id", getJob)
jobRoute.post("/jobs", createJob)
jobRoute.put("/jobs/:id", updateJob)
jobRoute.delete("/jobs/:id", deleteJob)
jobRoute.patch("/jobs/:id/close", closeJobPosting)

export default jobRoute