export const makeUser = (overrides = {}) => {
  const randomPassword = Math.random().toString(36).slice(-10) + "!A1";
  return {
    name: "Test User",
    email: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`,
    password: randomPassword,
    role: "CANDIDATE",
    ...overrides,
  };
};

export const makeJob = (overrides = {}) => ({
  title: "Backend Engineer",
  description: "Build APIs",
  requirements: "Node.js and MongoDB",
  requiredSkills: ["Node.js", "MongoDB"],
  type: "FULL_TIME",
  status: "ACTIVE",
  ...overrides,
});
