import { DevMiniLikeButton } from "@/client/features/dev/DevMiniLikeButton/DevMiniLikeButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMiniLikeButton } satisfies Meta<
  typeof DevMiniLikeButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { likedByLoggedInUser: false, likes: 10 },
};
