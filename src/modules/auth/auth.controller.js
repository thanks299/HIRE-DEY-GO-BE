import * as authService from "./auth.service.js";
import { createNotification } from "../notification/notification.service.js";
import { NotificationTypes, createNotificationMessage } from "../notification/notification.templates.js";

const handleRegister = async (payload, res) => {
  try {
    const result = await authService.registerUser(payload);

    if (result.user.role === "RECRUITER") {
      await createNotification({
        type: NotificationTypes.NEW_RECRUITER,
        message: createNotificationMessage(NotificationTypes.NEW_RECRUITER, {
          email: result.user.email,
        }),
      });
    }

    if (result.user.role === "CANDIDATE") {
      await createNotification({
        type: NotificationTypes.NEW_CANDIDATE,
        message: createNotificationMessage(NotificationTypes.NEW_CANDIDATE, {
          email: result.user.email,
        }),
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
    res.status(status).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

/**
 * Register a new user (legacy combined endpoint)
 */
export const register = async (req, res) => {
  return handleRegister(req.body, res);
};

/**
 * Register a new candidate
 */
export const registerCandidate = async (req, res) => {
  return handleRegister({ ...req.body, role: "CANDIDATE" }, res);
};

/**
 * Register a new recruiter
 */
export const registerRecruiter = async (req, res) => {
  return handleRegister({ ...req.body, role: "RECRUITER" }, res);
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
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

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    await authService.logoutUser(req.user._id);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

/**
 * Resend OTP
 */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.resendOtp(email);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully. Please check your email.",
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to resend OTP",
    });
  }
};
