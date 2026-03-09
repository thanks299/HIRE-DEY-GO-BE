import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateVerifyEmail,
  validateForgotPassword,
  validateResetPassword,
} from "./auth.validation.js";
import {
  register,
  login,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", validate(validateRegister), asyncHandler(register));
authRouter.post("/login", validate(validateLogin), asyncHandler(login));
authRouter.post("/refresh", validate(validateRefreshToken), asyncHandler(refreshToken));
authRouter.post("/verify-email", validate(validateVerifyEmail), asyncHandler(verifyEmail));
authRouter.post("/forgot-password", validate(validateForgotPassword), asyncHandler(forgotPassword));
authRouter.post("/reset-password", validate(validateResetPassword), asyncHandler(resetPassword));

export default authRouter;
