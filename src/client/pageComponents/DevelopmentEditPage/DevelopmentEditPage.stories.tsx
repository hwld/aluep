import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentEditPage } from "@/client/pageComponents/DevelopmentEditPage/DevelopmentEditPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { DevelopmentHelper, IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の編集",
  component: DevelopmentEditPage,
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
} satisfies Meta<typeof DevelopmentEditPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    idea: IdeaHelper.create(),
    development: DevelopmentHelper.create(),
    restoredValues: {},
  },
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
