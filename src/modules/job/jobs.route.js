import { Router } from "express";
import { closeJobPosting, createJob, deleteJob, getJob, getJobs, updateJob } from "./jobs.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const jobRoute = Router();

// Public routes
jobRoute.get("/jobs", getJobs);
jobRoute.get("/jobs/:id", getJob);

// Protected routes
jobRoute.post("/jobs", verifyToken, authorize("RECRUITER"), createJob);
jobRoute.patch("/jobs/:id", verifyToken, authorize("RECRUITER"), updateJob);
jobRoute.delete("/jobs/:id", verifyToken, authorize("RECRUITER"), deleteJob);
jobRoute.patch("/jobs/:id/close", verifyToken, authorize("RECRUITER"), closeJobPosting);

export default jobRoute