import { trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaComments } from "@/client/features/ideaComment/IdeaComments/IdeaComments";
import { IdeaCommentHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaComments } satisfies Meta<typeof IdeaComments>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { ideaId: "", ideaOwnerId: "", loggedInUser: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ expires: "", user: UserHelper.create() })
          );
        }),
        trpcMsw.ideaComment.getAll.query((req, res, ctx) => {
          const { create } = IdeaCommentHelper;
          return res(
            ctx.status(200),
            ctx.data([create({ inReplyToComment: undefined }), create()])
          );
        }),
      ],
    },
  },
};
