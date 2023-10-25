import { UserDevs } from "@/client/features/user/UserDevs/UserDevs";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserDevs } satisfies Meta<typeof UserDevs>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.dev.getDevsByUser, {
          list: [...new Array(6)].map(() => DevHelper.create()),
          allPages: 2,
        }),
      ],
    },
  },
};

export const Empty: Story = {
  args: { page: 1, user: UserHelper.create() },
};
