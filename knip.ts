import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx}"],
  jest: { config: ["**/jest.config.ts"] },
};

export default config;
