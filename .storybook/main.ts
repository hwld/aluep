import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    // TODO: @trpc/react-queryを導入してContextからtrpcを取得できるようにすれば
    // モジュールレベルのmockは必要なくなりそう
    config.resolve.alias[
      "/Users/hwld/work/projects/aluep/src/client/lib/trpc"
    ] = require.resolve("../src/client/__mocks__/trpc.ts");
    return config;
  },
};
export default config;
