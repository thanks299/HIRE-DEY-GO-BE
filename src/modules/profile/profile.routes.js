import { Router } from "express";
import {
  getMyProfile,
  createOrUpdateProfile,
} from "./profile.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const profileRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management endpoints
 */

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get the logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to fetch profile
 */
profileRoute.get(
  "/profile",
  verifyToken,
  authorize(["CANDIDATE", "RECRUITER"]),
  getMyProfile
);

/**
 * @swagger
 * /api/v1/profile:
 *   put:
 *     tags: [Profile]
 *     summary: Create or update the logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     location:
 *                       type: string
 *                     from:
 *                       type: string
 *                       format: date
 *                     to:
 *                       type: string
 *                       format: date
 *                     current:
 *                       type: boolean
 *                     description:
 *                       type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     institution:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     fieldOfStudy:
 *                       type: string
 *                     from:
 *                       type: string
 *                       format: date
 *                     to:
 *                       type: string
 *                       format: date
 *                     current:
 *                       type: boolean
 *                     description:
 *                       type: string
 *               resumeUrl:
 *                 type: string
 *               parsedResume:
 *                 type: object
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile saved successfully
 *       500:
 *         description: Failed to save profile
 */
profileRoute.put(
  "/profile",
  verifyToken,
  authorize(["CANDIDATE", "RECRUITER"]),
  createOrUpdateProfile
);

export default profileRoute;