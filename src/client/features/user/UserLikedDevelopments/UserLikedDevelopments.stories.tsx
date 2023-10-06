import { trpcMsw } from "@/client/__mocks__/trpc";
import { UserLikedDevelopments } from "@/client/features/user/UserLikedDevelopments/UserLikedDevelopments";
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
        trpcMsw.development.getLikedDevelopmentsByUser.query(
          (req, res, ctx) => {
            const { create } = DevelopmentHelper;
            return res(
              ctx.status(200),
              ctx.data({
                list: [...new Array(6)].map(() => create()),
                allPages: 2,
              })
            );
          }
        ),
      ],
    },
  },
};

export const Empty: Story = {
  args: { page: 1, user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.development.getLikedDevelopmentsByUser.query(
          (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.data({
                list: [],
                allPages: 1,
              })
            );
          }
        ),
      ],
    },
  },
};
