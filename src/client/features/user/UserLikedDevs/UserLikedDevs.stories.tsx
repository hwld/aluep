import { UserLikedDevs } from "@/client/features/user/UserLikedDevs/UserLikedDevs";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserLikedDevs } satisfies Meta<typeof UserLikedDevs>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.dev.getLikedDevsByUser, {
          list: [...new Array(6)].map(() => DevHelper.create()),
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
        mockTrpcQuery(trpcMsw.dev.getLikedDevsByUser, {
          list: [],
          allPages: 1,
        }),
      ],
    },
  },
};
