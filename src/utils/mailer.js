import { Resend } from "resend";
import {
  RESEND_API_KEY,
  EMAIL_FROM,
  FRONTEND_URL,
  NODE_ENV,
} from "../config/env.js";

const isDevelopment = NODE_ENV !== "production";

let resend;

if (!isDevelopment) {
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY in production environment");
  }
  resend = new Resend(RESEND_API_KEY);
}

const fromAddress = EMAIL_FROM || "onboarding@resend.dev";

const sendEmail = async (payload) => {
  try {
    if (isDevelopment) {
      console.log("\n📧 [DEV] Email captured:");
      console.log(`   To: ${payload.to}`);
      console.log(`   Subject: ${payload.subject}`);
      console.log(`   From: ${payload.from}`);

      const otpMatch = payload.html.match(/<strong>(\d{6})<\/strong>/);
      const linkMatch = payload.html.match(/href="([^"]+)"/);

      if (otpMatch) console.log(`   OTP: ${otpMatch[1]}`);
      if (linkMatch) console.log(`   Link: ${linkMatch[1]}`);
      console.log("");
      return;
    }

    const { data, error } = await resend.emails.send({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`✓ Email sent to ${payload.to} [id: ${data.id}]`);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Mail sending failed", { cause: error });
  }
};

export const sendOtpEmail = async (email, otp) => {
  await sendEmail({
    from: fromAddress,
    to: email,
    subject: "Verify your email – Hire Dey Go",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="background: #f3f4f6; border-radius: 6px; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">
          <strong>${otp}</strong>
        </div>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const baseUrl = FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    from: fromAddress,
    to: email,
    subject: "Reset your password – Hire Dey Go",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">Click the button below to reset your password. This link expires in <strong>30 minutes</strong>.</p>
        <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">If you didn't request a password reset, you can safely ignore this email.</p>
        <p style="color: #d1d5db; font-size: 12px; margin-top: 8px; word-break: break-all;">Or copy this link: ${resetLink}</p>
      </div>
    `,
  });
};