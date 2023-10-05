import { IdeaLikeButton } from "@/client/features/idea/IdeaLikeButton/IdeaLikeButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaLikeButton } satisfies Meta<
  typeof IdeaLikeButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { ideaId: "idea-id", likes: 10, likedByLoggedInUser: false },
};
