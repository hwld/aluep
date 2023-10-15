import { AppSidebar } from "@/client/ui/AppSidebar/AppSidebar";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppSidebar } satisfies Meta<typeof AppSidebar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Guest: Story = { name: "未ログイン" };
export const LoggedIn: Story = {
  name: "ログイン",
  args: { loggedInUser: UserHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          allLikes: 10,
          devs: 3,
          ideas: 8,
        }),
      ],
    },
  },
};
