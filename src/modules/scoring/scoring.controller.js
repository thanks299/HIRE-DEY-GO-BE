/**
 * Scoring Controller
 * Handles HTTP requests for job-fit scoring and candidate ranking
 */

import { getRankedCandidatesForJob, getJobFitScoreBreakdown } from "./scoring.service.js";

/**
 * GET /api/v1/jobs/:jobId/rankings
 * Get ranked candidates for a specific job
 * @access Recruiter
 */
export const getRankings = async (req, res) => {
  const { jobId } = req.params;

  if (!jobId) {
    const error = new Error("Job ID is required");
    error.status = 400;
    throw error;
  }

  const rankedCandidates = await Promise.resolve(
    getRankedCandidatesForJob(jobId, req.user)
  );

  res.status(200).json({
    success: true,
    message: `Retrieved ${rankedCandidates.candidates.length} ranked candidates`,
    data: rankedCandidates,
  });
};

/**
 * GET /api/v1/applications/:applicationId/score
 * Get detailed job-fit score breakdown for a specific application
 * @access Auth (Candidate or Recruiter)
 */
export const getJobFitScore = async (req, res) => {
  const { applicationId } = req.params;

  if (!applicationId) {
    const error = new Error("Application ID is required");
    error.status = 400;
    throw error;
  }

  const scoreBreakdown = await Promise.resolve(
    getJobFitScoreBreakdown(applicationId, req.user)
  );

  res.status(200).json({
    success: true,
    message: "Job-fit score retrieved successfully",
    data: scoreBreakdown,
  });
};
