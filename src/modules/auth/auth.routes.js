import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import verifyToken from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateVerifyEmail,
  validateForgotPassword,
  validateResetPassword,
  validateResendOtp,
} from "./auth.validation.js";
import {
  register,
  login,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  resendOtp,
} from "./auth.controller.js";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user account management
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user (Candidate or Recruiter)
 *     description: >
 *       Create a new account:
 *       - Candidates sign up with first & last name
 *       - Recruiters sign up with company details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - title: Candidate Registration
 *                 type: object
 *                 required: [firstName, lastName, email, password, role]
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [CANDIDATE]
 *
 *               - title: Recruiter Registration
 *                 type: object
 *                 required: [email, password, role, companyName, companyAddress]
 *                 properties:
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [RECRUITER]
 *                   companyName:
 *                     type: string
 *                   companyAddress:
 *                     type: string
 *                   companySize:
 *                     type: string
 *                     enum: [1-10, 11-50, 51-200, 201-500, 500+]
 *
 *           examples:
 *             candidateExample:
 *               summary: Candidate Signup Example
 *               value:
 *                 firstName: David
 *                 lastName: James
 *                 email: david@example.com
 *                 password: Password123
 *                 role: CANDIDATE
 *
 *             recruiterExample:
 *               summary: Recruiter Signup Example
 *               value:
 *                 email: hr@techcorp.com
 *                 password: Password123
 *                 role: RECRUITER
 *                 companyName: Tech Corp
 *                 companyAddress: Abuja, Nigeria
 *                 companySize: 11-50
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
authRouter.post(
  "/register",
  validate(validateRegister),
  asyncHandler(register)
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Authenticate user and return tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified or account suspended
 */
authRouter.post(
  "/login",
  validate(validateLogin),
  asyncHandler(login)
);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh authentication token
 *     description: Generate a new access token using a refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
authRouter.post(
  "/refresh",
  validate(validateRefreshToken),
  asyncHandler(refreshToken)
);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Verify user email
 *     description: Verify a user's email using a 6-digit OTP sent to their email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "916645"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       429:
 *         description: Too many verification attempts
 */
authRouter.post(
  "/verify-email",
  validate(validateVerifyEmail),
  asyncHandler(verifyEmail)
);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: If an account exists, a reset link has been sent
 */
authRouter.post(
  "/forgot-password",
  validate(validateForgotPassword),
  asyncHandler(forgotPassword)
);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset user password
 *     description: Resets the user's password using a reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, token, newPassword, confirmPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               token:
 *                 type: string
 *                 example: abc123resettoken
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
authRouter.post(
  "/reset-password",
  validate(validateResetPassword),
  asyncHandler(resetPassword)
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     description: Invalidates the user's refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
authRouter.post(
  "/logout",
  verifyToken,
  asyncHandler(logout)
);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend OTP
 *     description: Resends a new OTP to the user's email for verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Email already verified
 *       404:
 *         description: User not found
 */
authRouter.post(
  "/resend-otp",
  validate(validateResendOtp),
  asyncHandler(resendOtp)
);

export default authRouter;