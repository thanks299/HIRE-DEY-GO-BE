import { Router } from "express";
import { closeJobPosting, createJob, deleteJob, getJob, getJobs, updateJob } from "./jobs.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const jobRoute = Router();

// Public routes
/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get all jobs
 *     description: Returns a list of all jobs
 *     responses:
 *       200:
 *         description: Successful
 *   post:
 *     tags:
 *      - Jobs
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
 *
 * /api/v1/jobs/{id}:
 *   get:
 *     tags:
 *      - Jobs
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
 *   patch:
 *     tags:
 *       - Jobs
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
 *   delete:
 *     tags:
 *       - Jobs
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
 *
 * /api/v1/jobs/{id}/close:
 *   patch:
 *     tags:
 *      - Jobs
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


export default jobRoute