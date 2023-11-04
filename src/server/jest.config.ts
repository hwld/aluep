import { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  testTimeout: 20000,
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../$1",
  },
  testEnvironment: "@quramy/jest-prisma-node/environment",
  // サーバーのコードだけ含める。
  testMatch: ["<rootDir>/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest-server-setup.ts"],
};

module.exports = createJestConfig(customJestConfig);
