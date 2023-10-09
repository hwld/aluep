import { UserLikedDevelopments } from "@/client/features/user/UserLikedDevelopments/UserLikedDevelopments";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserLikedDevelopments } satisfies Meta<
  typeof UserLikedDevelopments
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.development.getLikedDevelopmentsByUser, {
          list: [...new Array(6)].map(() => DevelopmentHelper.create()),
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
        mockTrpcQuery(trpcMsw.development.getLikedDevelopmentsByUser, {
          list: [],
          allPages: 1,
        }),
      ],
    },
  },
};
