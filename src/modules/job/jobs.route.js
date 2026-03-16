import { Router } from "express";
import {
  closeJobPosting,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  updateJob,
} from "./jobs.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const jobRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management endpoints
 */

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get all jobs
 *     description: Returns a paginated list of all jobs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: deadline
 *         description: Sort field
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: ACTIVE
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: FULL_TIME
 *         description: Filter by job type
 *     responses:
 *       200:
 *         description: Successful
 */
jobRoute.get("/jobs", getJobs);

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create a new job
 *     description: Recruiter only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyId, title, description, requiredSkills, type]
 *             properties:
 *               companyId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               title:
 *                 type: string
 *                 example: Backend Engineer
 *               description:
 *                 type: string
 *                 example: Build and maintain APIs
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Node.js, MongoDB, Docker]
 *               type:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *                 example: FULL_TIME
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CLOSED]
 *                 example: ACTIVE
 *               location:
 *                 type: string
 *                 example: Lagos
 *               salary:
 *                 type: number
 *                 example: 150000
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — recruiters only
 */
jobRoute.post("/jobs", verifyToken, authorize("RECRUITER"), createJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get a single job
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job found
 *       404:
 *         description: Job not found
 */
jobRoute.get("/jobs/:id", getJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   patch:
 *     tags: [Jobs]
 *     summary: Update a job
 *     description: Recruiter only
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CLOSED]
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — recruiters only
 */
jobRoute.patch("/jobs/:id", verifyToken, authorize("RECRUITER"), updateJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job
 *     description: Recruiter only
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — recruiters only
 */
jobRoute.delete("/jobs/:id", verifyToken, authorize("RECRUITER"), deleteJob);

/**
 * @swagger
 * /api/v1/jobs/{id}/close:
 *   patch:
 *     tags: [Jobs]
 *     summary: Close a job posting
 *     description: Recruiter only
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job closed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — recruiters only
 */
jobRoute.patch("/jobs/:id/close", verifyToken, authorize("RECRUITER"), closeJobPosting);

export default jobRoute;