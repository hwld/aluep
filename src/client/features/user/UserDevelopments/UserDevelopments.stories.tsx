import { UserDevelopments } from "@/client/features/user/UserDevelopments/UserDevelopments";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserDevelopments } satisfies Meta<
  typeof UserDevelopments
>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.development.getDevelopmentsByUser, {
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
        mockTrpcQuery(trpcMsw.development.getDevelopmentsByUser, {
          list: [],
          allPages: 1,
        }),
      ],
    },
  },
};
