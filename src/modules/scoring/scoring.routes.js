import express from "express";
import { getRankings, getJobFitScore } from "./scoring.controller.js";
import { verifyToken, authorize } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const scoringRouter = express.Router();

/**
 * GET /api/v1/jobs/:jobId/rankings
 * Get ranked candidates for a specific job
 * @access Recruiter (verified token required)
 */
scoringRouter.get(
  "/jobs/:jobId/rankings",
  verifyToken,
  authorize("RECRUITER"),
  asyncHandler(getRankings)
);

/**
 * GET /api/v1/applications/:applicationId/score
 * Get detailed job-fit score breakdown for an application
 * @access Auth (verified token required)
 */
scoringRouter.get(
  "/applications/:applicationId/score",
  verifyToken,
  authorize(["CANDIDATE", "RECRUITER", "ADMIN"]),
  asyncHandler(getJobFitScore)
);

export default scoringRouter;
