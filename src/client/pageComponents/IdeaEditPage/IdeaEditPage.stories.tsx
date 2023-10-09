import { IdeaEditPage } from "@/client/pageComponents/IdeaEditPage/IdeaEditPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper, IdeaTagHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の編集",
  component: IdeaEditPage,
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
} satisfies Meta<typeof IdeaEditPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const tagSamples = [...new Array(3)].map(() => IdeaTagHelper.create());
export const Default: Story = {
  args: {
    idea: IdeaHelper.create({
      tags: tagSamples,
    }),
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, {
          user: UserHelper.create(),
          expires: "",
        }),
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          allLikes: 100,
          developments: 100,
          ideas: 100,
        }),
        mockTrpcQuery(trpcMsw.idea.getAllTags, tagSamples),
      ],
    },
  },
};
