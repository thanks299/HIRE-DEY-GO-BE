export const mockAuth = (req, res, next) => {
  req.user = {
    id: "65f1234567890abcdef12345",
    role: "user",
  };
  next();
};