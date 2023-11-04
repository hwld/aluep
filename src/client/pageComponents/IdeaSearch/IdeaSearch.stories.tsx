import { IdeaSearch } from "@/client/pageComponents/IdeaSearch/IdeaSearch";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の検索",
  component: IdeaSearch,
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
} satisfies Meta<typeof IdeaSearch>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Found: Story = {
  name: "結果あり",
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.idea.search, {
          ideas: [...new Array(10)].map(() => IdeaHelper.createFilled()),
          allPages: 2,
        }),
      ],
    },
  },
};

export const NotFound: Story = {
  name: "結果なし",
};
