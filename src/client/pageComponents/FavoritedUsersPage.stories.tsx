import { trpcMsw } from "@/client/__mocks__/trpc";
import { FavoritedUsersPage } from "@/client/pageComponents/FavoritedUsersPage";
import { AppLayout } from "@/client/ui/AppLayout";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お気に入りユーザー",
  component: FavoritedUsersPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <AppLayout>
          <Story />
        </AppLayout>
      );
    },
  ],
} satisfies Meta<typeof FavoritedUsersPage>;
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
        trpcMsw.user.getFavoritedUsers.query((req, res, ctx) => {
          const { create } = UserHelper;
          return res(
            ctx.status(200),
            ctx.data({ list: [create(), create(), create()], allPages: 1 })
          );
        }),
      ],
    },
  },
};
