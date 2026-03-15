import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token is required. Please login.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.user = { _id: decoded.userId, role: decoded.role }; // ← attach role here
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired. Please refresh your token.",
      });
    }
    return res.status(403).json({
      success: false,
      message: "Invalid or malformed token",
    });
  }
};

export const authorize = (allowedRoles) => (req, res, next) => {
  // Role already available from token — no DB call needed
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to access this resource",
    });
  }

  next();
};

export default verifyToken;