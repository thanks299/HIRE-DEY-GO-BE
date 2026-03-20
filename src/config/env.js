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
  // SMTP_HOST,
  // SMTP_PORT,
  // SMTP_USER,
  // SMTP_PASS,
  // SMTP_FROM = "noreply@hiredeygo.com",
  RESEND_API_KEY = process.env.RESEND_API_KEY,
  EMAIL_FROM = process.env.EMAIL_FROM,
  FRONTEND_URL = "http://localhost:3000",
  CLIENT_URL = "http://localhost:3000",
  CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_URL = process.env.CLOUDINARY_URL,
  GROQ_API_KEY = process.env.GROQ_API_KEY,
} = process.env;

