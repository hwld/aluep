import { IdeaCommentForm } from "@/client/features/ideaComment/IdeaCommentForm/IdeaCommentForm";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaCommentForm } satisfies Meta<
  typeof IdeaCommentForm
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { ideaId: "", loggedInUser: UserHelper.create() },
};
