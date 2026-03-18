import { Router } from "express";
import { verifyToken as authenticate, authorize } from "../../middlewares/auth.middleware.js";
import multer from "multer";
import * as companyController from "./company.controller.js";
 
const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
});
 
/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company profile management
 */
 
/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a company profile
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [1-10, 11-50, 51-200, 201-500, 501-1000, 1000+]
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created
 *       409:
 *         description: Company already exists for this user
 */
router.post("/", authenticate, authorize("RECRUITER"), companyController.createCompany);
 
/**
 * @swagger
 * /companies/me:
 *   get:
 *     summary: Get my company profile
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company profile
 *       404:
 *         description: No company profile found
 */
router.get("/me", authenticate, authorize("RECRUITER"), companyController.getMyCompany);
 
/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 */
router.get("/:id", companyController.getCompany);
 
/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     summary: Update a company profile
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated
 *       403:
 *         description: Forbidden
 */
router.patch("/:id", authenticate, authorize("RECRUITER"), companyController.updateCompany);
 
/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
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
 *         description: Company deleted
 *       403:
 *         description: Forbidden
 */
router.delete("/:id", authenticate, authorize("RECRUITER"), companyController.deleteCompany);
 
/**
 * @swagger
 * /companies/{id}/logo:
 *   post:
 *     summary: Upload company logo
 *     tags: [Companies]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 */
router.post(
  "/:id/logo",
  authenticate,
  authorize("RECRUITER"),
  upload.single("logo"),
  companyController.uploadLogo
);
 
/**
 * @swagger
 * /companies/{id}/jobs:
 *   get:
 *     summary: Get all jobs posted by a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CLOSED, DRAFT, ALL]
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get("/:id/jobs", companyController.getCompanyJobs);
 
export default router;