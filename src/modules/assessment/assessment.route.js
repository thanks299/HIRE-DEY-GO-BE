import { Router } from "express";
import { attachAssessmentToJob, createAssessment, getAssessmentResult, startAssessment, submitAssessment } from "./assessment.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const assessmentRouter = Router();

/**
 * @swagger
 * /api/v1/assessments:
 *   post:
 *     summary: Create a new assessment
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *               - timeLimit
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frontend Developer Test
 *               description:
 *                 type: string
 *                 example: React and JavaScript assessment
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "JavaScript"]
 *               timeLimit:
 *                 type: number
 *                 example: 30
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionText:
 *                       type: string
 *                       example: What is React?
 *                     type:
 *                       type: string
 *                       enum: [MCQ, SHORT_ANSWER, SITUATIONAL]
 *                       example: MCQ
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Library", "Database", "Framework"]
 *                     correctAnswer:
 *                       type: string
 *                       example: Library
 *                     points:
 *                       type: number
 *                       example: 5
 *     responses:
 *       201:
 *         description: Assessment created successfully
 */

assessmentRouter.post("/assessments", verifyToken, authorize("RECRUITER"), createAssessment);


//assessmentRouter.post("/assessments/:id");
//assessmentRouter.post("/assessments/:id");

/**
 * @swagger
 * /api/v1/jobs/{jobId}/assessments/{assessmentId}:
 *   post:
 *     summary: Attach an assessment to a job
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f123abc123
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f987abc456
 *     responses:
 *       200:
 *         description: Assessment attached to job successfully
 *       404:
 *         description: Job not found
 */
assessmentRouter.post("/jobs/:jobId/assessments/:assessmentId", verifyToken, attachAssessmentToJob);

/**
 * @swagger
 * /api/v1/jobs/{jobId}/assessment:
 *   get:
 *     summary: Start a job assessment
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f123abc123
 *     responses:
 *       200:
 *         description: Assessment started successfully
 *       403:
 *         description: Skill score does not meet job requirement
 *       400:
 *         description: Candidate already took this assessment
 */
assessmentRouter.get("/jobs/:jobId/assessment",verifyToken, startAssessment);

/**
 * @swagger
 * /api/v1/assessments/{id}/submit:
 *   post:
 *     summary: Submit answers for an assessment
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f987abc456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - answers
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: 665f123abc123
 *               timeTaken:
 *                 type: number
 *                 example: 20
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       example: 665faaa111bbb
 *                     answer:
 *                       type: string
 *                       example: Library
 *     responses:
 *       200:
 *         description: Assessment submitted and graded
 *       400:
 *         description: Assessment already submitted
 */
assessmentRouter.post("/assessments/:id/submit", verifyToken, authorize("CANDIDATE"), submitAssessment);

/**
 * @swagger
 * /api/v1/assessments/{id}/result:
 *   get:
 *     summary: Get candidate assessment result
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f987abc456
 *     responses:
 *       200:
 *         description: Assessment result retrieved
 *       404:
 *         description: Result not found
 */
assessmentRouter.get("/assessments/:id/result", verifyToken, authorize("CANDIDATE"), getAssessmentResult);

export default assessmentRouter