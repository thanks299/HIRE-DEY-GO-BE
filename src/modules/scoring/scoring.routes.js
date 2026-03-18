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
 *     description: Returns candidates who submitted the assessment on time, ranked by highest score. Tie-breaker is earliest submission. Candidates who missed the deadline are excluded and marked REJECTED.
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
 *                 message:
 *                   type: string
 *                   example: "3 candidate(s) ranked, 1 excluded"
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     totalApplications:
 *                       type: integer
 *                     totalRanked:
 *                       type: integer
 *                     totalExcluded:
 *                       type: integer
 *                     ranked:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rank:
 *                             type: integer
 *                             example: 1
 *                           applicationId:
 *                             type: string
 *                           userId:
 *                             type: string
 *                           email:
 *                             type: string
 *                           assessmentScore:
 *                             type: number
 *                             example: 85
 *                           rawScore:
 *                             type: number
 *                           maxScore:
 *                             type: number
 *                           completedAt:
 *                             type: string
 *                             format: date-time
 *                           timeTaken:
 *                             type: number
 *                           status:
 *                             type: string
 *                             example: ASSESSED
 *                     excluded:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           applicationId:
 *                             type: string
 *                           userId:
 *                             type: string
 *                           email:
 *                             type: string
 *                           status:
 *                             type: string
 *                             example: REJECTED
 *                           reason:
 *                             type: string
 *                             enum: [no_submission, late_submission]
 *                           feedback:
 *                             type: string
 *                             example: "Your assessment was submitted after the 30-minute time limit elapsed. You have not been moved to the next stage."
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
 *     summary: Get score breakdown for an application
 *     description: Returns the assessment score and submission details for a specific application. Candidates can only view their own score. Includes feedback if the candidate was excluded due to late or missing submission.
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
 *         description: Score returned successfully
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
 *                     jobId:
 *                       type: string
 *                     jobTitle:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: ASSESSED
 *                     appliedAt:
 *                       type: string
 *                       format: date-time
 *                     rank:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     hasSubmitted:
 *                       type: boolean
 *                     assessment:
 *                       nullable: true
 *                       type: object
 *                       properties:
 *                         score:
 *                           type: number
 *                         maxScore:
 *                           type: number
 *                         percentage:
 *                           type: number
 *                           example: 85
 *                         completedAt:
 *                           type: string
 *                           format: date-time
 *                         timeTaken:
 *                           type: number
 *                         submittedLate:
 *                           type: boolean
 *                     feedback:
 *                       type: string
 *                       nullable: true
 *                       example: "Your assessment was submitted after the 30-minute time limit elapsed. You have not been moved to the next stage."
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