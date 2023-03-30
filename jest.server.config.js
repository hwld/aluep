const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories: ["node_modules"],
  testEnvironment: "@quramy/jest-prisma-node/environment",
  // サーバーのコードだけ含める。
  testMatch: ["<rootDir>/src/server/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest-server-setup.js"],
};

module.exports = createJestConfig(customJestConfig);
