import { Router } from "express";
import {
  closeJobPosting,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  updateJob,
  getMyJobs,
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, deadline]
 *           example: newest
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CLOSED, DRAFT]
 *           example: ACTIVE
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, VOLUNTEER, REMOTE]
 *           example: FULL_TIME
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: Engineering
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           example: Nigeria
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: Lagos
 *       - in: query
 *         name: isRemote
 *         schema:
 *           type: boolean
 *           example: true
 *       - in: query
 *         name: jobLevel
 *         schema:
 *           type: string
 *           enum: [JUNIOR, MID_LEVEL, SENIOR, MANAGER, DIRECTOR, EXECUTIVE]
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [ENTRY, MID, SENIOR, LEAD, EXECUTIVE]
 *       - in: query
 *         name: educationLevel
 *         schema:
 *           type: string
 *           enum: [ANY, HIGH_SCHOOL, OND, HND, BSC, PGD, MSC, PHD]
 *       - in: query
 *         name: salaryType
 *         schema:
 *           type: string
 *           enum: [HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY]
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *           example: Node.js
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: backend engineer
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
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
 *             required: [companyId, title, description, type]
 *             properties:
 *               companyId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               title:
 *                 type: string
 *                 example: Backend Engineer
 *               jobRole:
 *                 type: string
 *                 example: Software Engineer
 *               companyName:
 *                 type: string
 *                 example: Acme Corp
 *               category:
 *                 type: string
 *                 example: Engineering
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [nodejs, backend, api]
 *               description:
 *                 type: string
 *                 example: Build and maintain scalable APIs
 *               requirements:
 *                 type: string
 *                 example: 3+ years experience with Node.js
 *               responsibilities:
 *                 type: string
 *                 example: Design and implement REST APIs
 *               benefits:
 *                 type: string
 *                 example: Health insurance, remote work
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Node.js, MongoDB, Docker]
 *               type:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, VOLUNTEER, REMOTE]
 *                 example: FULL_TIME
 *               jobLevel:
 *                 type: string
 *                 enum: [JUNIOR, MID_LEVEL, SENIOR, MANAGER, DIRECTOR, EXECUTIVE]
 *                 example: MID_LEVEL
 *               experienceLevel:
 *                 type: string
 *                 enum: [ENTRY, MID, SENIOR, LEAD, EXECUTIVE]
 *                 example: MID
 *               experienceYears:
 *                 type: string
 *                 enum: ["0", "1-2", "3-5", "6-10", "10+"]
 *                 example: "3-5"
 *               educationLevel:
 *                 type: string
 *                 enum: [ANY, HIGH_SCHOOL, OND, HND, BSC, PGD, MSC, PHD]
 *                 example: BSC
 *               vacancies:
 *                 type: integer
 *                 example: 3
 *               salaryMin:
 *                 type: number
 *                 example: 150000
 *               salaryMax:
 *                 type: number
 *                 example: 300000
 *               salaryType:
 *                 type: string
 *                 enum: [HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY]
 *                 example: MONTHLY
 *               currency:
 *                 type: string
 *                 example: NGN
 *               isSalaryNegotiable:
 *                 type: boolean
 *                 example: false
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               city:
 *                 type: string
 *                 example: Lagos
 *               location:
 *                 type: string
 *                 example: Victoria Island, Lagos
 *               isRemote:
 *                 type: boolean
 *                 example: false
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-30"
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE]
 *                 example: ACTIVE
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
 * /api/v1/jobs/my-jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get my posted jobs
 *     description: Recruiter only
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CLOSED, DRAFT]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, VOLUNTEER, REMOTE]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, deadline]
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — recruiters only
 */
jobRoute.get("/jobs/my-jobs", verifyToken, authorize("RECRUITER"), getMyJobs);
 
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
 *     description: Recruiter only — must be the job owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               jobRole:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               benefits:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, VOLUNTEER, REMOTE]
 *               jobLevel:
 *                 type: string
 *                 enum: [JUNIOR, MID_LEVEL, SENIOR, MANAGER, DIRECTOR, EXECUTIVE]
 *               experienceLevel:
 *                 type: string
 *                 enum: [ENTRY, MID, SENIOR, LEAD, EXECUTIVE]
 *               experienceYears:
 *                 type: string
 *                 enum: ["0", "1-2", "3-5", "6-10", "10+"]
 *               educationLevel:
 *                 type: string
 *                 enum: [ANY, HIGH_SCHOOL, OND, HND, BSC, PGD, MSC, PHD]
 *               vacancies:
 *                 type: integer
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               salaryType:
 *                 type: string
 *                 enum: [HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY]
 *               currency:
 *                 type: string
 *               isSalaryNegotiable:
 *                 type: boolean
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               location:
 *                 type: string
 *               isRemote:
 *                 type: boolean
 *               deadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, CLOSED]
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — must be job owner
 */
jobRoute.patch("/jobs/:id", verifyToken, authorize("RECRUITER"), updateJob);
 
/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job
 *     description: Recruiter only — must be the job owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — must be job owner
 */
jobRoute.delete("/jobs/:id", verifyToken, authorize("RECRUITER"), deleteJob);
 
/**
 * @swagger
 * /api/v1/jobs/{id}/close:
 *   patch:
 *     tags: [Jobs]
 *     summary: Close a job posting
 *     description: Recruiter only — must be the job owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job closed successfully
 *       400:
 *         description: Job already closed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — must be job owner
 */
jobRoute.patch("/jobs/:id/close", verifyToken, authorize("RECRUITER"), closeJobPosting);
 
export default jobRoute;
 