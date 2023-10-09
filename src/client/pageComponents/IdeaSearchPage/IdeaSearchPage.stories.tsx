import { IdeaSearchPage } from "@/client/pageComponents/IdeaSearchPage/IdeaSearchPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
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
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.idea.getAllTags, []),
        mockTrpcQuery(trpcMsw.idea.search, {
          ideas: [...new Array(3)].map(() => IdeaHelper.create()),
          allPages: 1,
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
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.idea.getAllTags, []),
        mockTrpcQuery(trpcMsw.idea.search, { ideas: [], allPages: 1 }),
      ],
    },
  },
};
