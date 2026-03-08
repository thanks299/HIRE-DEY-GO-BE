import crypto from "node:crypto";
import User from "../../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/generateToken.js";
import { sendEmail } from "../../utils/email.util.js";

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password, role = "CANDIDATE" }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      role,
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Email - HIREDEYGO",
      text: `Your verification code is: ${otp}. Valid for 10 minutes.`,
      html: `
        <h2>Welcome to HIREDEYGO!</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      message: "Registration successful. Please verify your email.",
    };
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(email, otp) {
    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("Email already verified");
    if (!user.otp || !user.otpExpires) throw new Error("No OTP found. Please request a new one.");
    if (user.otpExpires < new Date()) throw new Error("OTP has expired. Please request a new one.");
    if (user.otp !== otp) throw new Error("Invalid OTP");

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: "Email verified successfully" };
  }

  /**
   * Resend OTP
   */
  async resendOTP(email) {
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("Email already verified");

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail({
      to: email,
      subject: "New Verification Code - HIREDEYGO",
      text: `Your new verification code is: ${otp}. Valid for 10 minutes.`,
      html: `
        <h2>New Verification Code</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    return { message: "New OTP sent successfully" };
  }

  /**
   * Login user
   */
  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("Invalid credentials");
    if (!user.isVerified) throw new Error("Please verify your email before logging in");
    if (user.isBanned) throw new Error("Your account has been suspended. Contact support.");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) throw new Error("Refresh token is required");

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }
    if (user.isBanned) throw new Error("Your account has been suspended");

    const newAccessToken = generateAccessToken(user._id, user.role);

    return { accessToken: newAccessToken };
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      return { message: "If an account exists, a password reset link has been sent." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request - HIREDEYGO",
      text: `Reset your password: ${resetUrl}. Valid for 30 minutes.`,
      html: `
        <h2>Password Reset Request</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    });

    return { message: "If an account exists, a password reset link has been sent." };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) throw new Error("Invalid or expired reset token");

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Changed Successfully - HIREDEYGO",
      text: "Your password has been changed successfully.",
      html: `
        <h2>Password Changed</h2>
        <p>Your password has been changed successfully.</p>
        <p>If you didn't make this change, contact support immediately.</p>
      `,
    });

    return { message: "Password reset successful. Please login with your new password." };
  }

  /**
   * Change password (logged-in user)
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");

    if (!user) throw new Error("User not found");

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) throw new Error("Current password is incorrect");

    if (currentPassword === newPassword) {
      throw new Error("New password must be different from current password");
    }

    user.password = newPassword;
    user.refreshToken = undefined; // Invalidate existing sessions
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Changed - HIREDEYGO",
      text: "Your password has been changed successfully.",
      html: `
        <h2>Password Changed</h2>
        <p>Your password was changed successfully.</p>
        <p>If you didn't do this, reset your password immediately.</p>
      `,
    });

    return { message: "Password changed successfully. Please login again." };
  }

  /**
   * Logout user
   */
  async logout(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.refreshToken = undefined;
    await user.save();

    return { message: "Logged out successfully" };
  }
}

export default new AuthService();