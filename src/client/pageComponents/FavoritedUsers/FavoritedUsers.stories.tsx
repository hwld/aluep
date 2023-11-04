import { FavoritedUsers } from "@/client/pageComponents/FavoritedUsers/FavoritedUsers";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お気に入りユーザー",
  component: FavoritedUsers,
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
} satisfies Meta<typeof FavoritedUsers>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { user: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
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
};

export const Filled: Story = {
  args: { user: UserHelper.createFilled() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.user.getFavoritedUsers, {
          list: [...new Array(10)].map(() => UserHelper.createFilled()),
          allPages: 2,
        }),
      ],
    },
  },
};
