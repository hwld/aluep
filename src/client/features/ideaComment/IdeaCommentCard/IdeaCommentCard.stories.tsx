import { trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaCommentCard } from "@/client/features/ideaComment/IdeaCommentCard/IdeaCommentCard";
import { IdeaCommentHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: IdeaCommentCard,
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ expires: "", user: UserHelper.create() })
          );
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
