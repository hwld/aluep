import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentDetailPage } from "@/client/pageComponents/DevelopmentDetailPage";
import { AppLayout } from "@/client/ui/AppLayout";
import { DevelopmentHelper, IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の詳細",
  component: DevelopmentDetailPage,
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
} satisfies Meta<typeof DevelopmentDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { idea: IdeaHelper.create(), development: DevelopmentHelper.create() },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.development.isDevelopedByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data({ developed: false }));
        }),
        trpcMsw.developmentMemo.getAll.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};
