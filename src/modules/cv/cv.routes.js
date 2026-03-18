import { Router } from "express";
import multer from "multer";
import { verifyToken as authenticate, authorize } from "../../middlewares/auth.middleware.js";
import * as cvController from "./cv.controller.js";
 
const router = Router();
 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF and Word documents are allowed"));
    }
    cb(null, true);
  },
});
 
// All CV routes require CANDIDATE role
router.use(authenticate, authorize("CANDIDATE"));
 
/**
 * @swagger
 * tags:
 *   name: CV
 *   description: CV upload and AI parsing
 */
 
/**
 * @swagger
 * /cv/upload:
 *   post:
 *     summary: Upload a CV (PDF or Word)
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CV uploaded, resumeUrl saved to profile
 *       400:
 *         description: No file uploaded or invalid file type
 */
router.post("/upload", upload.single("cv"), cvController.uploadCV);
 
/**
 * @swagger
 * /cv/parse:
 *   post:
 *     summary: Upload and parse a CV using AI
 *     description: Extracts structured data (skills, experience, education) from a CV using Claude AI. Returns parsed data for review. Call /cv/apply afterwards to update your profile.
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Parsed CV data returned for review
 *       422:
 *         description: Could not extract text from CV
 */
router.post("/parse", upload.single("cv"), cvController.parseCV);
 
/**
 * @swagger
 * /cv/apply:
 *   post:
 *     summary: Apply parsed CV data to your profile
 *     description: Takes the last parsed CV data and merges it into your profile. Only fills empty fields and appends new experience/education/skills.
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated with CV data
 *       400:
 *         description: No parsed CV data found — parse a CV first
 */
router.post("/apply", cvController.applyParsedCV);
 
export default router;
