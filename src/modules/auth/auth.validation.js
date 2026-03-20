/**
 * Auth Module Validation Schemas
 * Using Zod for schema validation as per README specification
 */

import { z } from "zod";

/**
 * Register validation schema
 */
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim()
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name must contain only letters, spaces, hyphens, and apostrophes"
    ).optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim()
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name must contain only letters, spaces, hyphens, and apostrophes"
    ).optional(),
  email: z
    .string({ required_error: "Email is required" })
    .toLowerCase()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  role: z.enum(["CANDIDATE", "RECRUITER"], {
    errorMap: () => ({ message: "Invalid role. Only CANDIDATE or RECRUITER allowed" }),
  }).default("CANDIDATE"),

  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companySize: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "CANDIDATE") {
    if (!data.firstName) {
      ctx.addIssue({ path: ["firstName"], message: "First name is required" });
    }
    if (!data.lastName) {
      ctx.addIssue({ path: ["lastName"], message: "Last name is required" });
    }
  }

  if (data.role === "RECRUITER") {
    if (!data.companyName) {
      ctx.addIssue({ path: ["companyName"], message: "Company name is required" });
    }
    if (!data.companyAddress) {
      ctx.addIssue({ path: ["companyAddress"], message: "Company address is required" });
    }
  }
});

/**
 * Wrapper function for backward compatibility with existing middleware
 */
export const validateRegister = (data) => {
  try {
    const sanitized = registerSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      sanitized,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
        sanitized: null,
      };
    }
    throw error;
  }
};

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .toLowerCase()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password cannot be empty"),
});

/**
 * Wrapper function for backward compatibility
 */
export const validateLogin = (data) => {
  try {
    const sanitized = loginSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      sanitized,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
        sanitized: null,
      };
    }
    throw error;
  }
};

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: "Refresh token is required" })
    .min(1, "Refresh token cannot be empty")
    .trim(),
});

/**
 * Wrapper function for backward compatibility
 */
export const validateRefreshToken = (data) => {
  try {
    const sanitized = refreshTokenSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      sanitized,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
        sanitized: null,
      };
    }
    throw error;
  }
};

/**
 * Verify email validation schema
 */
export const verifyEmailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .toLowerCase()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"),
  otp: z
    .string({ required_error: "OTP is required" })
    .regex(/^\d{6}$/, "OTP must be a 6-digit number")
    .trim(),
});

/**
 * Wrapper function for backward compatibility
 */
export const validateVerifyEmail = (data) => {
  try {
    const sanitized = verifyEmailSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      sanitized,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
        sanitized: null,
      };
    }
    throw error;
  }
};

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .toLowerCase()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"),
});

/**
 * Wrapper function for backward compatibility
 */
export const validateForgotPassword = (data) => {
  try {
    const sanitized = forgotPasswordSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      sanitized,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
        sanitized: null,
      };
    }
    throw error;
  }
};

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .toLowerCase()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"),
  token: z
    .string({ required_error: "Reset token is required" })
    .min(1, "Reset token cannot be empty")
    .trim(),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  confirmPassword: z
    .string({ required_error: "Password confirmation is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * Wrapper function for backward compatibility
 */
export const validateResetPassword = (data) => {
  try {
    const sanitized = resetPasswordSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      sanitized,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
        sanitized: null,
      };
    }
    throw error;
  }
};

export const resendOtpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .toLowerCase()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"),
});

export const validateResendOtp = (data) => {
  try {
    const sanitized = resendOtpSchema.parse(data);
    return { isValid: true, errors: [], sanitized };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return { isValid: false, errors, sanitized: null };
    }
    throw error;
  }
};