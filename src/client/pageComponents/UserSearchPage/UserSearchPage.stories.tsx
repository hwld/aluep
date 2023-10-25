import { UserSearchPage } from "@/client/pageComponents/UserSearchPage/UserSearchPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/ユーザーの検索",
  component: UserSearchPage,
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
} satisfies Meta<typeof UserSearchPage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const BeforeSearch: Story = {
  name: "検索前",
  parameters: {
    nextjs: { router: { query: {} } },
  },
};

export const NotFound: Story = {
  name: "結果なし",
  parameters: {
    nextjs: { router: { query: { userName: "no" } } },
  },
};

export const Found: Story = {
  name: "結果あり",
  parameters: {
    nextjs: { router: { query: { userName: "user" } } },
    msw: {
      handlers: [
        mockTrpcQuery(
          trpcMsw.user.search,
          [...new Array(3)].map(() => UserHelper.create())
        ),
      ],
    },
  },
};
