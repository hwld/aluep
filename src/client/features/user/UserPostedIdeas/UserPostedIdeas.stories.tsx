import { UserPostedIdeas } from "@/client/features/user/UserPostedIdeas/UserPostedIdeas";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserPostedIdeas } satisfies Meta<
  typeof UserPostedIdeas
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Empty: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.idea.getPostedIdeasByUser, {
          list: [],
          allPages: 1,
        }),
      ],
    },
  },
};

export const Default: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.idea.getPostedIdeasByUser, {
          list: [...new Array(6)].map(() => IdeaHelper.create()),
          allPages: 2,
        }),
      ],
    },
  },
};
