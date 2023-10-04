import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopIdeaPage } from "@/client/pageComponents/DevelopIdeaPage/DevelopIdeaPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
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
export const Default: Story = {
  args: { idea: IdeaHelper.create(), restoredValues: {} },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.development.isDevelopedByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data({ developed: false }));
        }),
        trpcMsw.development.getDevelopmentStatuses.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};
