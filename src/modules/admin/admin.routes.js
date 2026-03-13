// admin/admin.routes.js
import express from "express";
import {
  getDashboardStats,
  getRecruiterAnalytics,
  getCandidateAnalytics,
  getPlatformAnalytics,
  getNotifications,
  getUsers,
  suspendUser,
  deleteUser,
  moderateJob,
} from "./admin.controller.js";

import verifyToken from "../../middlewares/auth.middleware.js";

const router = express.Router();

/** 
*  @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 * 
 * 
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get overall dashboard stats
 *     description: Returns recruiters, candidates, jobs, and platform statistics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/dashboard", verifyToken, getDashboardStats);

/**
 * @swagger
 * /api/v1/admin/recruiters:
 *   get:
 *     summary: Get recruiter analytics
 *     description: Returns list of recruiters, their activity, and jobs posted
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recruiter analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/recruiters", getRecruiterAnalytics);

/**
 * @swagger
 * /api/v1/admin/candidates:
 *   get:
 *     summary: Get candidate analytics
 *     description: Returns stats about registered candidates, applications, qualified, and hired
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/candidates", getCandidateAnalytics);

/**
 * @swagger
 * /api/v1/admin/analytics:
 *   get:
 *     summary: Get platform analytics
 *     description: Returns time saved, qualification rate, satisfaction, and recruiter return rate
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/analytics", getPlatformAnalytics);

/**
 * @swagger
 * /api/v1/admin/notifications:
 *   get:
 *     summary: Get latest notifications
 *     description: Returns last 20 notifications for admin
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/notifications",getNotifications);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Returns list of all candidates and recruiters
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/users", getUsers);

/**
 * @swagger
 * /api/v1/admin/users/{id}/suspend:
 *   patch:
 *     summary: Suspend a user
 *     description: Suspend a candidate or recruiter account by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to suspend
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       401:
 *         description: Unauthorized
 */
router.patch("/users/:id/suspend", suspendUser);

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Remove a candidate or recruiter account by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /api/v1/admin/jobs/{id}:
 *   delete:
 *     summary: Moderate (delete) a job
 *     description: Remove a job posting by ID if inappropriate
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/jobs/:id",moderateJob);

export default router;
