export default {
  testEnvironment: "node",
  projects: [
    {
      displayName: "unit",
      testMatch: ["**/tests/unit/**/*.test.js"],
      setupFilesAfterEnv: ["<rootDir>/tests/unit/setup.js"],
    },
    {
      displayName: "integration",
      testMatch: ["**/tests/integration/**/*.test.js"],
      setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.js"],
      testTimeout: 30000,
    },
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/app.js",
    "!src/config/**",
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["/node_modules/"],
};
