import { Meta, StoryObj } from "@storybook/react";
import { AnimationLikeIcon } from "./AnimationLikeIcon";

const meta = {
  component: AnimationLikeIcon,
} satisfies Meta<typeof AnimationLikeIcon>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Liked: Story = { args: { liked: true } };
export const UnLiked: Story = { args: { liked: false } };
