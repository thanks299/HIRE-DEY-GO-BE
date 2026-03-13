import { config } from "dotenv";

config({ path: ".env" });

export const {
  MONGODB_URI = "mongodb://localhost:27017/hire-dey-go-test",
  PORT = 5000,
  NODE_ENV = "development",
  JWT_SECRET = "test-jwt-secret-key",
  JWT_REFRESH_SECRET = "test-jwt-refresh-secret-key",
  JWT_EXPIRES_IN = "1h",
  JWT_REFRESH_EXPIRES_IN = "7d",
  OTP_EXPIRES_IN = "10m",
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM = "noreply@hiredeygo.com",
  FRONTEND_URL = "http://localhost:3000",
} = process.env;

