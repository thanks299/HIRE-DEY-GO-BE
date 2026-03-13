/**
 * Validation Utility
 * Provides validation helpers for request data
 */

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password) => {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Validate OTP format (6-digit number)
 */
export const isValidOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate name part (2-50 characters, letters, spaces, hyphens, apostrophes)
 */
export const isValidName = (name) => {
  if (!name || name.length < 2 || name.length > 50) return false;
  return /^[a-zA-Z\s'-]+$/.test(name.trim());
};

export const isValidFirstName = (firstName) => isValidName(firstName);

export const isValidLastName = (lastName) => isValidName(lastName);

/**
 * Validate role
 */
export const isValidRole = (role) => {
  const validRoles = ['CANDIDATE', 'RECRUITER'];
  return validRoles.includes(role);
};

/**
 * Sanitize string input (trim and remove excessive whitespace)
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Create validation error response
 */
export const validationError = (field, message) => {
  return {
    field,
    message,
  };
};
