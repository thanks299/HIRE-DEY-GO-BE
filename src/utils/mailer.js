import nodemailer from "nodemailer";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  FRONTEND_URL,
  NODE_ENV,
} from "../config/env.js";

const isDevelopment = NODE_ENV !== "production";
const hasSmtpConfig = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);

// In development, use console logging instead of real SMTP.
let transporter;

if (isDevelopment) {
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
  });
} else if (hasSmtpConfig) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
  });
} else {
  throw new Error(
    "Missing SMTP configuration for production. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS"
  );
}

export { transporter };

const fromAddress = SMTP_FROM || "noreply@hiredeygo.com";

const sendEmail = async (payload) => {
  try {
    if (isDevelopment) {
      // In development, log email instead of sending
      console.log("\n📧 [DEV] Email captured:");
      console.log(`   To: ${payload.to}`);
      console.log(`   Subject: ${payload.subject}`);
      console.log(`   From: ${payload.from}`);
      
      // Extract OTP or reset link from HTML
      const otpMatch = payload.html.match(/<strong>(\d{6})<\/strong>/);
      const linkMatch = payload.html.match(/href="([^"]+)"/);
      
      if (otpMatch) {
        console.log(`   OTP: ${otpMatch[1]}`);
      }
      if (linkMatch) {
        console.log(`   Link: ${linkMatch[1]}`);
      }
      console.log("");
    } else {
      await transporter.sendMail(payload);
      console.log(`✓ Email sent to ${payload.to}`);
    }
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Email delivery failed");
  }
};

export const sendOtpEmail = async (email, otp) => {
  await sendEmail({
    from: fromAddress,
    to: email,
    subject: "Email Verification - HIRE DEY GO BE",
    html: `<h2>Email Verification</h2><p>Your OTP: <strong>${otp}</strong></p><p>Valid for 10 minutes</p>`,
  });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const baseUrl = FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${email}`;

  await sendEmail({
    from: fromAddress,
    to: email,
    subject: "Password Reset - HIRE DEY GO BE",
    html: `<h2>Reset Your Password</h2><p><a href="${resetLink}">Click here to reset your password</a></p><p>Link expires in 30 minutes</p>`,
  });
};