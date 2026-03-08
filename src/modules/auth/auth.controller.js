import authService from "./auth.service.js";
import User from "../../models/user.model.js";
import { successResponse, errorResponse } from "../../utils/response.util.js";

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const result = await authService.register({ name, email, password, role });
      return successResponse(res, result, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async verifyEmail(req, res) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyEmail(email, otp);
      return successResponse(res, result, 200);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async resendOTP(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.resendOTP(email);
      return successResponse(res, result, 200);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, {
        user: result.user,
        accessToken: result.accessToken,
      }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refreshToken(refreshToken);
      return successResponse(res, result, 200);
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return successResponse(res, result, 200);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      return successResponse(res, result, 200);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
      return successResponse(res, result, 200);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req.user.id);
      res.clearCookie("refreshToken");
      return successResponse(res, { message: "Logged out successfully" }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return errorResponse(res, "User not found", 404);
      return successResponse(res, { user }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

export default new AuthController();