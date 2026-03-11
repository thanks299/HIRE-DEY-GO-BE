import { Router } from "express";
import {
  createApplication,
  getMyApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
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
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job to apply for
 *               coverLetter:
 *                 type: string
 *               resumeUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Bad request
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
 */
applicationRoute.get(
  "/applications",
  verifyToken,
  authorize("CANDIDATE"),
  getMyApplications
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
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application fetched successfully
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
 *               resumeUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated successfully
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
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 */
applicationRoute.delete(
  "/applications/:id",
  verifyToken,
  authorize("CANDIDATE"),
  deleteApplication
);

export default applicationRoute;