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
 *       401:
 *         description: Unauthorized
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
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               location:
 *                 type: string
 *                 example: Lagos, Nigeria
 *               bio:
 *                 type: string
 *                 example: Experienced backend developer with 3 years of Node.js experience
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Node.js, MongoDB, Docker]
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Backend Engineer
 *                     company:
 *                       type: string
 *                       example: Tech Company Ltd
 *                     location:
 *                       type: string
 *                       example: Lagos, Nigeria
 *                     from:
 *                       type: string
 *                       format: date
 *                       example: "2021-01-01"
 *                     to:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-01"
 *                     current:
 *                       type: boolean
 *                       example: false
 *                     description:
 *                       type: string
 *                       example: Built and maintained REST APIs
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     institution:
 *                       type: string
 *                       example: University of Lagos
 *                     degree:
 *                       type: string
 *                       example: BSc Computer Science
 *                     fieldOfStudy:
 *                       type: string
 *                       example: Computer Science
 *                     from:
 *                       type: string
 *                       format: date
 *                       example: "2017-09-01"
 *                     to:
 *                       type: string
 *                       format: date
 *                       example: "2021-06-01"
 *                     current:
 *                       type: boolean
 *                       example: false
 *                     description:
 *                       type: string
 *                       example: Graduated with First Class Honours
 *               resumeUrl:
 *                 type: string
 *                 example: https://example.com/resume.pdf
 *               parsedResume:
 *                 type: object
 *               avatarUrl:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Profile saved successfully
 *       401:
 *         description: Unauthorized
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