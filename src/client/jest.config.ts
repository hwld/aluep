import { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  moduleDirectories: ["node_modules"],
  testEnvironment: "jest-environment-jsdom",
  // クライアントのコードだけ含める
  testMatch: ["<rootDir>/**/*.test.ts?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest-client-setup.ts"],
};

module.exports = createJestConfig(customJestConfig);
