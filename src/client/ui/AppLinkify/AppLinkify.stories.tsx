import { Meta, StoryObj } from "@storybook/react";
import { AppLinkify } from "./AppLinkify";

const meta = {
  component: AppLinkify,
} satisfies Meta<typeof AppLinkify>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: "hello https://example.com" },
};
