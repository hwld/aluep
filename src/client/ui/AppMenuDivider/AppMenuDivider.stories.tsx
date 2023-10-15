import { Meta, StoryObj } from "@storybook/react";
import { AppMenuDivider } from "./AppMenuDivider";

const meta = {
  component: AppMenuDivider,
} satisfies Meta<typeof AppMenuDivider>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};