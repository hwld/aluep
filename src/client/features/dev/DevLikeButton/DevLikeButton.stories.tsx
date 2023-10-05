import { DevLikeButton } from "@/client/features/dev/DevLikeButton/DevLikeButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevLikeButton } satisfies Meta<typeof DevLikeButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideaId: "idea-id",
    developmentId: "development-id",
    likedByLoggedInUser: false,
    likes: 1,
  },
};
