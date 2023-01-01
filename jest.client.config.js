const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories: ["node_modules"],
  testEnvironment: "jest-environment-jsdom",
  // サーバーのコードを含めない
  testPathIgnorePatterns: ["<rootDir>/src/server/"],
};

module.exports = createJestConfig(customJestConfig);
