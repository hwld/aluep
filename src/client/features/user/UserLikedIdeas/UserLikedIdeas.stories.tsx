import { UserLikedIdeas } from "@/client/features/user/UserLikedIdeas/UserLikedIdeas";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserLikedIdeas } satisfies Meta<
  typeof UserLikedIdeas
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.idea.getLikedIdeasByUser, {
          list: [...new Array(6)].map(() => IdeaHelper.create()),
          allPages: 2,
        }),
      ],
    },
  },
};

export const Empty: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.idea.getLikedIdeasByUser, {
          list: [],
          allPages: 1,
        }),
      ],
    },
  },
};
