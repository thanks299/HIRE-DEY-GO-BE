/**
 * Validate request body using provided validator function
 * @param {Function} validator - Validation function that returns {isValid, errors, sanitized}
 */
export const validate = (validator) => {
  return (req, res, next) => {
    const { isValid, errors, sanitized } = validator(req.body);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }
    
    // Replace req.body with sanitized data
    req.body = sanitized;
    
    next();
  };
};

export default validate;
