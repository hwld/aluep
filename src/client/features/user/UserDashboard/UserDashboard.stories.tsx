import { UserDashboard } from "@/client/features/user/UserDashboard/UserDashboard";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserDashboard } satisfies Meta<typeof UserDashboard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.isFavoritedByLoggedInUser, false),
        mockTrpcQuery(trpcMsw.user.getFavoriteCountByUser, 0),
      ],
    },
  },
};
