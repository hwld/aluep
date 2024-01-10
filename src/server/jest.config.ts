import { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../$1",
  },
  testEnvironment: "@quramy/jest-prisma-node/environment",
  // サーバーのコードだけ含める。
  testMatch: ["<rootDir>/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest-server-setup.ts"],
};

// transformIgnorePatternsをcustomJestConfigで上書きすることができないのでこの方法を使う。
// https://github.com/vercel/next.js/discussions/34774#discussioncomment-2246460
module.exports = async (...args: any[]) => {
  const fn = createJestConfig(customJestConfig);
  // @ts-ignore
  const res = await fn(...args);
  res.transformIgnorePatterns = res.transformIgnorePatterns?.map((pattern) => {
    if (pattern === "/node_modules/") {
      // デフォルトではnode_modules以下のファイルはCJSとみなして変換されないのだが、
      // superjsonがv2からESM-onlyになったので、superjsonは変換されるように設定する。
      return "/node_modules/(?!(superjson))";
    }
    return pattern;
  });

  return res;
};
