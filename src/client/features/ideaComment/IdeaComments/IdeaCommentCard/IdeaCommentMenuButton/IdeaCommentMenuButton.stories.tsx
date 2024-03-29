import { IdeaCommentMenuButton } from "@/client/features/ideaComment/IdeaComments/IdeaCommentCard/IdeaCommentMenuButton/IdeaCommentMenuButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaCommentMenuButton } satisfies Meta<
  typeof IdeaCommentMenuButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { ideaId: "", commentId: "", isOwner: false },
};
