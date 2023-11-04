import { Meta, StoryObj } from "@storybook/react";
import { About } from "./About";

const meta = {
  component: About,
} satisfies Meta<typeof About>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
