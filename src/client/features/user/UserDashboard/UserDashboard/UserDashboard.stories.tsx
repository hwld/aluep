import { trpcMsw } from "@/client/__mocks__/trpc";
import { UserDashboard } from "@/client/features/user/UserDashboard/UserDashboard/UserDashboard";
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
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.user.isFavoritedByLoggedInUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(false));
        }),
        trpcMsw.user.getFavoriteCountByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(0));
        }),
      ],
    },
  },
};
