import { UserProfileCard } from "@/client/features/user/UserProfileCard/UserProfileCard";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserProfileCard } satisfies Meta<
  typeof UserProfileCard
>;
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
