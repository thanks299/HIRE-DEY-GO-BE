import * as authService from "./auth.service.js";
import { createNotification } 
from "../notification/notification.service.js";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    // req.body is already validated and sanitized by validation middleware
    const result = await authService.registerUser(req.body);

    if (result.user.role === "RECRUITER") {
      await createNotification({
        type: "NEW_RECRUITER",
        message: "A new recruiter registered"
      });
    }
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    const status = error.status || 500;
    await createNotification({
      type: "NEW_RECRUITER",
      message: "A new recruiter registered"
    });
    res.status(status).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    // req.body is already validated and sanitized by validation middleware
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req, res) => {
  try {
    // req.body is already validated and sanitized by validation middleware
    const { refreshToken: token } = req.body;
    const result = await authService.refreshUserToken(token);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      tokens: result.tokens,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Token refresh failed",
    });
  }
};

/**
 * Verify email with OTP
 */
export const verifyEmail = async (req, res) => {
  try {
    // req.body is already validated and sanitized by validation middleware
    const result = await authService.verifyUserEmail(req.body);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result.user,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Email verification failed",
    });
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent",
    });
  } catch (error) {
    // Log error for debugging but return generic message for security
    console.error("Forgot password error:", error);
    res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent",
    });
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req, res) => {
  try {
    // req.body is already validated and sanitized by validation middleware
    await authService.resetUserPassword(req.body);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Password reset failed",
    });
  }
};
