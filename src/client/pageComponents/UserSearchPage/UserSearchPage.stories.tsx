import { trpcMsw } from "@/client/__mocks__/trpc";
import { UserSearchPage } from "@/client/pageComponents/UserSearchPage/UserSearchPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
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
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.user.search.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};

export const NotFound: Story = {
  name: "結果なし",
  parameters: {
    nextjs: { router: { query: { userName: "no" } } },
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.user.search.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};
export const Found: Story = {
  name: "結果あり",
  parameters: {
    nextjs: { router: { query: { userName: "user" } } },
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.user.search.query((req, res, ctx) => {
          const { create } = UserHelper;
          return res(ctx.status(200), ctx.data([create(), create(), create()]));
        }),
      ],
    },
  },
};
