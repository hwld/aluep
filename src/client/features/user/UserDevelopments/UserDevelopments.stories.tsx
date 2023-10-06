import { trpcMsw } from "@/client/__mocks__/trpc";
import { UserDevelopments } from "@/client/features/user/UserDevelopments/UserDevelopments";
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
        trpcMsw.development.getDevelopmentsByUser.query((req, res, ctx) => {
          const { create } = DevelopmentHelper;
          return res(
            ctx.status(200),
            ctx.data({
              list: [...new Array(6)].map(() => create()),
              allPages: 2,
            })
          );
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
        trpcMsw.development.getDevelopmentsByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data({ list: [], allPages: 1 }));
        }),
      ],
    },
  },
};
