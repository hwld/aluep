import { DevelopIdeaPage } from "@/client/pageComponents/DevelopIdeaPage/DevelopIdeaPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の開発",
  component: DevelopIdeaPage,
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
} satisfies Meta<typeof DevelopIdeaPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseHandlers = [
  mockTrpcQuery(trpcMsw.session, null),
  mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
    developed: false,
  }),
  mockTrpcQuery(trpcMsw.development.getDevelopmentStatuses, []),
];

export const FilledIdea: Story = {
  args: { idea: IdeaHelper.createFilled(), restoredValues: {} },
  parameters: {
    msw: {
      handlers: [...baseHandlers],
    },
  },
};
