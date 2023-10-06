import { trpcMsw } from "@/client/__mocks__/trpc";
import { UserLikedIdeas } from "@/client/features/user/UserLikedIdeas/UserLikedIdeas";
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
        trpcMsw.idea.getLikedIdeasByUser.query((req, res, ctx) => {
          const { create } = IdeaHelper;
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
        trpcMsw.idea.getLikedIdeasByUser.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({
              list: [],
              allPages: 1,
            })
          );
        }),
      ],
    },
  },
};
