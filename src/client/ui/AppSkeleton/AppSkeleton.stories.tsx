import { Meta, StoryObj } from "@storybook/react";
import { AppSkeleton } from "./AppSkeleton";

const meta = {
  component: AppSkeleton,
} satisfies Meta<typeof AppSkeleton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
