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
    this.name = "ServiceError";
  }
}

/* ---------------- TOKEN GENERATION ---------------- */

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

/* ---------------- OTP GENERATION ---------------- */

export const generateOTP = () => {
  return (crypto.randomInt(100000, 999999)).toString();
};

/* ---------------- REGISTER USER ---------------- */

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}) => {

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ServiceError("Email already registered", 409);
  }

  const allowedRoles = ["CANDIDATE", "RECRUITER"];
  const userRole = allowedRoles.includes(role) ? role : "CANDIDATE";

  const otp = generateOTP();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    role: userRole,
    otp: hashedOtp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    otpAttempts: 0
  });

  await newUser.save();

  await sendOtpEmail(newUser.email, otp);

  const accessToken = generateAccessToken(newUser._id, newUser.role);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;
  await newUser.save();

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

/* ---------------- LOGIN USER ---------------- */

export const loginUser = async ({ email, password }) => {

  const user = await User.findOne({ email })
    .select("+password +refreshToken");

  if (!user) {
    throw new ServiceError("Invalid email or password", 401);
  }

  if (user.isBanned) {
    throw new ServiceError(
      "Your account has been suspended. Please contact support.",
      403
    );
  }

  if (!user.isVerified) {
    throw new ServiceError(
      "Please verify your email before logging in",
      403
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ServiceError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

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

/* ---------------- REFRESH TOKEN ---------------- */

export const refreshUserToken = async (token) => {

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

  const user = await User.findById(decoded.userId)
    .select("+refreshToken");

  if (!user) {
    throw new ServiceError("User not found", 401);
  }

  if (user.isBanned) {
    throw new ServiceError(
      "Your account has been suspended. Please contact support.",
      403
    );
  }

  if (user.refreshToken !== token) {
    throw new ServiceError("Invalid refresh token", 401);
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;

  await user.save();

  return {
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
};

/* ---------------- VERIFY EMAIL ---------------- */

export const verifyUserEmail = async ({ email, otp }) => {

  const user = await User.findOne({ email })
    .select("+otp +otpExpires +otpAttempts");

  if (!user) {
    throw new ServiceError("User not found", 404);
  }

  if (user.isVerified) {
    throw new ServiceError("Email is already verified", 400);
  }

  if (user.otpAttempts >= 5) {
    throw new ServiceError(
      "Too many verification attempts. Request a new OTP.",
      429
    );
  }

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (user.otp !== hashedOtp) {
    user.otpAttempts += 1;
    await user.save();
    throw new ServiceError("Invalid OTP", 400);
  }

  if (user.otpExpires < new Date()) {
    throw new ServiceError("OTP has expired", 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;

  await user.save();

  return {
    user: {
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified,
    },
  };
};

/* ---------------- REQUEST PASSWORD RESET ---------------- */

export const requestPasswordReset = async (email) => {

  const user = await User.findOne({ email });

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);

  await user.save();

  await sendPasswordResetEmail(email, resetToken);
};

/* ---------------- RESET PASSWORD ---------------- */

export const resetUserPassword = async ({
  email,
  token,
  newPassword
}) => {

  const user = await User.findOne({ email })
    .select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new ServiceError("User not found", 404);
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  if (user.passwordResetToken !== hashedToken) {
    throw new ServiceError("Invalid reset token", 400);
  }

  if (user.passwordResetExpires < new Date()) {
    throw new ServiceError("Reset token has expired", 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;

  await user.save();
};