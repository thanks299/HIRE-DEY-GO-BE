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
 *     description: Returns a list of all jobs
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
 *     responses:
 *       201:
 *         description: Job created successfully
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
jobRoute.patch("/jobs/:id", verifyToken, authorize("RECRUITER"), updateJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
jobRoute.delete("/jobs/:id", verifyToken, authorize("RECRUITER"), deleteJob);

/**
 * @swagger
 * /api/v1/jobs/{id}/close:
 *   patch:
 *     tags: [Jobs]
 *     summary: Close a job posting
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job closed successfully
 */
jobRoute.patch("/jobs/:id/close", verifyToken, authorize("RECRUITER"), closeJobPosting);

export default jobRoute;