import { Config } from "jest";

const customJestConfig: Config = {
  testTimeout: 20000,
  projects: [
    "<rootDir>/src/server/jest.config.ts",
    "<rootDir>/src/client/jest.config.ts",
  ],
};

module.exports = customJestConfig;
