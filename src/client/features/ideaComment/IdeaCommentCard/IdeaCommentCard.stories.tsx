import { IdeaCommentCard } from "@/client/features/ideaComment/IdeaCommentCard/IdeaCommentCard";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaCommentHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: IdeaCommentCard,
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, {
          user: UserHelper.create(),
          expires: "",
        }),
      ],
    },
  },
} satisfies Meta<typeof IdeaCommentCard>;
export default meta;

type Story = StoryObj<typeof meta>;

const baseArgs: Story["args"] = {
  ideaId: "",
  isOwner: false,
  ideaOwnerId: "",
  comment: IdeaCommentHelper.create(),
};

export const Default: Story = {
  name: "返信ではない",
  args: {
    ...baseArgs,
    comment: IdeaCommentHelper.create({ inReplyToComment: undefined }),
  },
};

export const InReplyTo: Story = {
  name: "返信元あり",
  args: { ...baseArgs, comment: IdeaCommentHelper.create() },
};

export const DeletedReply: Story = {
  name: "返信元が削除されている",
  args: {
    ...baseArgs,
    comment: IdeaCommentHelper.create({ inReplyToComment: null }),
  },
};
