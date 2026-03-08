import express from "express";
import authController from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authLimiter, otpLimiter } from "../../middleware/rateLimiter.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOTPSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./auth.validation.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/verify-email", authLimiter, validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-otp", otpLimiter, validate(resendOTPSchema), authController.resendOTP);
router.post("/refresh", authLimiter, validate(refreshTokenSchema), authController.refreshToken);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);
router.post("/logout", authenticate, authController.logout);

export default router;