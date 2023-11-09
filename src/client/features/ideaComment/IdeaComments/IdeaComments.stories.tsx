import { IdeaComments } from "@/client/features/ideaComment/IdeaComments/IdeaComments";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
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
        mockTrpcQuery(trpcMsw.session, {
          user: UserHelper.create(),
          expires: "",
        }),
        mockTrpcQuery(trpcMsw.ideaComment.getAll, () => {
          const { create } = IdeaCommentHelper;
          return [create({ parentComment: undefined }), create()];
        }),
      ],
    },
  },
};
