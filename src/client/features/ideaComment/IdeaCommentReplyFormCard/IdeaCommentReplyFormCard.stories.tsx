import { IdeaCommentReplyFormCard } from "@/client/features/ideaComment/IdeaCommentReplyFormCard/IdeaCommentReplyFormCard";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaCommentReplyFormCard } satisfies Meta<
  typeof IdeaCommentReplyFormCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
