import { FavoritedUsersPage } from "@/client/pageComponents/FavoritedUsersPage/FavoritedUsersPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
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
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.getFavoritedUsers, {
          list: [...new Array(3)].map(() => UserHelper.create()),
          allPages: 1,
        }),
      ],
    },
  },
};

export const Empty: Story = {
  args: { user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.getFavoritedUsers, {
          list: [],
          allPages: 1,
        }),
      ],
    },
  },
};
