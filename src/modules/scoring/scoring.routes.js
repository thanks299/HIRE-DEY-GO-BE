import express from "express";
import { getRankings, getJobFitScore } from "./scoring.controller.js";
import { verifyToken, authorize } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const scoringRouter = express.Router();

/**
 * @swagger
 * /api/v1/jobs/{jobId}/rankings:
 *   get:
 *     tags:
 *       - Scoring
 *     summary: Get ranked candidates for a job
 *     description: Returns a ranked list of candidates who applied for a specific job. Accessible by recruiters only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the job
 *     responses:
 *       200:
 *         description: Ranked candidates returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     totalApplications:
 *                       type: integer
 *                     candidates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rank:
 *                             type: integer
 *                           applicationId:
 *                             type: string
 *                           candidateId:
 *                             type: string
 *                           jobFitScore:
 *                             type: number
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — only recruiters can access this
 *       404:
 *         description: Job not found
 */
scoringRouter.get(
  "/jobs/:jobId/rankings",
  verifyToken,
  authorize("RECRUITER"),
  asyncHandler(getRankings)
);

/**
 * @swagger
 * /api/v1/applications/{applicationId}/score:
 *   get:
 *     tags:
 *       - Scoring
 *     summary: Get job-fit score breakdown for an application
 *     description: Returns a detailed job-fit score breakdown for a specific application. Candidates can only view their own score.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the application
 *     responses:
 *       200:
 *         description: Score breakdown returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     applicationId:
 *                       type: string
 *                     jobFitScore:
 *                       type: number
 *                       example: 78.5
 *                     breakdown:
 *                       type: object
 *                       properties:
 *                         skillsScore:
 *                           type: number
 *                         experienceScore:
 *                           type: number
 *                         assessmentScore:
 *                           type: number
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — candidates can only view their own score
 *       404:
 *         description: Application not found
 */
scoringRouter.get(
  "/applications/:applicationId/score",
  verifyToken,
  authorize(["CANDIDATE", "RECRUITER", "ADMIN"]),
  asyncHandler(getJobFitScore)
);

export default scoringRouter;