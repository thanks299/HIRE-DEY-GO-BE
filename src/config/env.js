import { config } from "dotenv";

config({ path: ".env" });

export const {
  MONGODB_URI,
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN = "1h",
  JWT_REFRESH_EXPIRES_IN = "7d",
  OTP_EXPIRES_IN = "10m",
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  FRONTEND_URL,
} = process.env;