import { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig: Config = {
  moduleDirectories: ["node_modules"],
  testEnvironment: "@quramy/jest-prisma-node/environment",
  // サーバーのコードだけ含める。
  testMatch: ["<rootDir>/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest-server-setup.ts"],
};

module.exports = createJestConfig(customJestConfig);