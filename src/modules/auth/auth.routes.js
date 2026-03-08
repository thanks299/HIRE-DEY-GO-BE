import express from "express";
import authController from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
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
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-otp", validate(resendOTPSchema), authController.resendOTP);
router.post("/refresh", validate(refreshTokenSchema), authController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);
router.post("/logout", authenticate, authController.logout);

export default router;