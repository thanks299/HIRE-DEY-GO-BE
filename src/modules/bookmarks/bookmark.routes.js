import { Router } from "express";
import { verifyToken as authenticate, authorize } from "../../middlewares/auth.middleware.js";
import * as bookmarkController from "./bookmark.controller.js";
 
const router = Router();
 
// All bookmark routes require authentication
router.use(authenticate);
 
/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Save and manage bookmarks
 */
 
// ── Job Bookmarks (CANDIDATE) ───────────────────────────────────
 
/**
 * @swagger
 * /bookmarks/jobs/{jobId}:
 *   post:
 *     summary: Toggle job bookmark (add or remove)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark toggled
 *       404:
 *         description: Job not found
 */
router.post(
  "/jobs/:jobId",
  authorize("CANDIDATE"),
  bookmarkController.toggleJobBookmark
);
 
/**
 * @swagger
 * /bookmarks/jobs:
 *   get:
 *     summary: Get all bookmarked jobs
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of bookmarked jobs
 */
router.get("/jobs", authorize("CANDIDATE"), bookmarkController.getBookmarkedJobs);
 
// ── Company Bookmarks (CANDIDATE) ───────────────────────────────
 
/**
 * @swagger
 * /bookmarks/companies/{companyId}:
 *   post:
 *     summary: Toggle company bookmark (add or remove)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark toggled
 *       404:
 *         description: Company not found
 */
router.post(
  "/companies/:companyId",
  authorize("CANDIDATE"),
  bookmarkController.toggleCompanyBookmark
);
 
/**
 * @swagger
 * /bookmarks/companies:
 *   get:
 *     summary: Get all bookmarked companies
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of bookmarked companies
 */
router.get(
  "/companies",
  authorize("CANDIDATE"),
  bookmarkController.getBookmarkedCompanies
);
 
// ── Candidate Bookmarks (RECRUITER) ────────────────────────────
 
/**
 * @swagger
 * /bookmarks/candidates/{candidateId}:
 *   post:
 *     summary: Toggle candidate bookmark (add or remove)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark toggled
 *       404:
 *         description: Candidate not found
 */
router.post(
  "/candidates/:candidateId",
  authorize("RECRUITER"),
  bookmarkController.toggleCandidateBookmark
);
 
/**
 * @swagger
 * /bookmarks/candidates:
 *   get:
 *     summary: Get all bookmarked candidates
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of bookmarked candidates
 */
router.get(
  "/candidates",
  authorize("RECRUITER"),
  bookmarkController.getBookmarkedCandidates
);
 
export default router;
