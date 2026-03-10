import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required. Please login.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired. Please refresh your token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or malformed token",
    });
  }
};

/**
 * Middleware to check if user has specific role(s)
 * @param {string|string[]} allowedRoles - Role(s) that are allowed
 */
export const authorize =
  (allowedRoles) => async (req, res, next) => {
    try {
      const User = (await import("../models/user.model.js")).default;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const roles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };

export default verifyToken;
