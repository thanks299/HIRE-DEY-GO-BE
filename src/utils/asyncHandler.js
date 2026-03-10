/**
 * Wrapper to catch async errors in route handlers
 * @param {Function} fn - The async route handler
 * @returns {Function} - Wrapped function that catches errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res)).catch(next);
};

export default asyncHandler;
