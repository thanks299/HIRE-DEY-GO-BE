import { Router } from "express";
import {
  createApplication,
  getMyApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
  getJobApplications,
} from "./application.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const applicationRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Application management endpoints
 */

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     tags: [Applications]
 *     summary: Create a new application
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId]
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               coverLetter:
 *                 type: string
 *                 example: I am excited to apply for this role...
 *               resumeUrl:
 *                 type: string
 *                 example: https://example.com/resume.pdf
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate application
 */
applicationRoute.post(
  "/applications",
  verifyToken,
  authorize("CANDIDATE"),
  createApplication
);

/**
 * @swagger
 * /api/v1/applications:
 *   get:
 *     tags: [Applications]
 *     summary: Get all applications of the logged-in candidate
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications fetched successfully
 *       401:
 *         description: Unauthorized
 */
applicationRoute.get(
  "/applications",
  verifyToken,
  authorize("CANDIDATE"),
  getMyApplications
);

/**
 * @swagger
 * /api/v1/applications/job/{jobId}:
 *   get:
 *     tags: [Applications]
 *     summary: Get all applications for a job
 *     description: Recruiter only — returns all applications for a specific job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Job ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [APPLIED, ASSESSED, SHORTLISTED, INTERVIEW, HIRED, REJECTED]
 *           example: SHORTLISTED
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Applications fetched successfully
 *       400:
 *         description: Invalid jobId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — recruiters only
 */
applicationRoute.get(
  "/applications/job/:jobId",
  verifyToken,
  authorize("RECRUITER"),
  getJobApplications
);

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   get:
 *     tags: [Applications]
 *     summary: Get a single application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
applicationRoute.get(
  "/applications/:id",
  verifyToken,
  authorize("CANDIDATE"),
  getSingleApplication
);

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   put:
 *     tags: [Applications]
 *     summary: Update an existing application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *                 example: Updated cover letter content...
 *               resumeUrl:
 *                 type: string
 *                 example: https://example.com/updated-resume.pdf
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
applicationRoute.put(
  "/applications/:id",
  verifyToken,
  authorize("CANDIDATE"),
  updateApplication
);

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   delete:
 *     tags: [Applications]
 *     summary: Delete an application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
applicationRoute.delete(
  "/applications/:id",
  verifyToken,
  authorize("CANDIDATE"),
  deleteApplication
);

/**
 * @swagger
 * /api/v1/applications/{id}/status:
 *   patch:
 *     tags: [Applications]
 *     summary: Update application status
 *     description: Recruiter only — update the status of an application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPLIED, ASSESSED, SHORTLISTED, INTERVIEW, HIRED, REJECTED]
 *                 example: SHORTLISTED
 *               interviewDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-01T10:00:00.000Z"
 *               interviewNotes:
 *                 type: string
 *                 example: Strong candidate, good communication skills
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       400:
 *         description: Invalid status or application id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — recruiters only
 *       404:
 *         description: Application not found
 */
applicationRoute.patch(
  "/applications/:id/status",
  verifyToken,
  authorize("RECRUITER"),
  updateApplicationStatus
);

export default applicationRoute;