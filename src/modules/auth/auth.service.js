import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import User from "../../models/user.model.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../../utils/mailer.js";
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN
} from "../../config/env.js";

class ServiceError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'ServiceError';
  }
}

/**
 * Generate Access Token
 * @param {string} userId - User ID
 * @returns {string} JWT access token
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Generate Refresh Token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Generate OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.role - User's role
 * @returns {Promise<Object>} Registration result with user data and tokens
 */
export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ServiceError("Email already registered", 409);
  }

  // Prevent privilege escalation: Only allow CANDIDATE or RECRUITER roles during registration
  // ADMIN role can only be assigned manually by existing admins
  const allowedRoles = ['CANDIDATE', 'RECRUITER'];
  const userRole = allowedRoles.includes(role) ? role : 'CANDIDATE';

  // Create new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    role: userRole,
    otp: generateOTP(),
    otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  await newUser.save();

  // Send OTP email
  await sendOtpEmail(newUser.email, newUser.otp);

  // Generate tokens
  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  return {
    user: {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Login result with user data and tokens
 */
export const loginUser = async ({ email, password }) => {
  // Find user and select password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ServiceError("Invalid email or password", 401);
  }

  // Check if user is banned
  if (user.isBanned) {
    throw new ServiceError("Your account has been suspended. Please contact support.", 403);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ServiceError("Invalid email or password", 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return {
    user: {
      userId: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Refresh access token using refresh token
 * @param {string} token - Refresh token
 * @returns {Promise<Object>} New access and refresh tokens
 */
export const refreshUserToken = async (token) => {
  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ServiceError("Refresh token has expired", 401);
    }

    if (error.name === "JsonWebTokenError") {
      throw new ServiceError("Invalid refresh token", 401);
    }

    throw new ServiceError("Invalid or expired refresh token", 401);
  }

  // Check if user still exists
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ServiceError("User not found", 401);
  }

  // Check if user is banned
  if (user.isBanned) {
    throw new ServiceError("Your account has been suspended. Please contact support.", 403);
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  return {
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
};

/**
 * Verify email with OTP
 * @param {Object} verificationData - Verification data
 * @param {string} verificationData.email - User's email
 * @param {string} verificationData.otp - OTP code
 * @returns {Promise<Object>} Verification result with user data
 */
export const verifyUserEmail = async ({ email, otp }) => {
  // Find user with OTP
  const user = await User.findOne({ email }).select("+otp +otpExpires");

  if (!user) {
    throw new ServiceError("User not found", 404);
  }

  // Check if OTP is valid
  if (user.otp !== otp) {
    throw new ServiceError("Invalid OTP", 400);
  }

  // Check if OTP is expired
  if (user.otpExpires < new Date()) {
    throw new ServiceError("OTP has expired", 400);
  }

  // Mark email as verified
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return {
    user: {
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified,
    },
  };
};

/**
 * Request password reset
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const requestPasswordReset = async (email) => {
  // Find user
  const user = await User.findOne({ email });

  // Return early for security (don't reveal if user exists)
  if (!user) {
    return;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await user.save();

  // Send password reset email
  await sendPasswordResetEmail(email, resetToken);
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.email - User's email
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.newPassword - New password
 * @returns {Promise<void>}
 */
export const resetUserPassword = async ({ email, token, newPassword }) => {
  // Find user
  const user = await User.findOne({ email }).select(
    "+passwordResetToken +passwordResetExpires"
  );

  if (!user) {
    throw new ServiceError("User not found", 404);
  }

  // Verify reset token
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  if (user.passwordResetToken !== hashedToken) {
    throw new ServiceError("Invalid reset token", 400);
  }

  // Check if token is expired
  if (user.passwordResetExpires < new Date()) {
    throw new ServiceError("Reset token has expired", 400);
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};
