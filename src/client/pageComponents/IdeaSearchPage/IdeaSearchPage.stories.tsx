import { trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaSearchPage } from "@/client/pageComponents/IdeaSearchPage/IdeaSearchPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の検索",
  component: IdeaSearchPage,
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
} satisfies Meta<typeof IdeaSearchPage>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Found: Story = {
  name: "結果あり",
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.idea.getAllTags.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
        trpcMsw.idea.search.query((req, res, ctx) => {
          const { create } = IdeaHelper;
          return res(
            ctx.status(200),
            ctx.data({ ideas: [create(), create(), create()], allPages: 1 })
          );
        }),
      ],
    },
  },
};

export const NotFound: Story = {
  name: "結果なし",
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.idea.getAllTags.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
        trpcMsw.idea.search.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data({ ideas: [], allPages: 1 }));
        }),
      ],
    },
  },
};
