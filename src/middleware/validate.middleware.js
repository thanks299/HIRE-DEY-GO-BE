import { errorResponse } from "../utils/response.util.js";

/**
 * Validate request using Zod schema
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return errorResponse(res, "Validation failed", 400, errors);
    }
  };
};