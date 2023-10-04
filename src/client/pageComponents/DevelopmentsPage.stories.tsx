import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentsPage } from "@/client/pageComponents/DevelopmentsPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { DevelopmentHelper, IdeaHelper } from "@/models/tests/helpers";
import { DevelopmentStatusIds } from "@/share/consts";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の一覧",
  component: DevelopmentsPage,
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
} satisfies Meta<typeof DevelopmentsPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.create() },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.development.getManyByIdea.query((req, res, ctx) => {
          const { create } = DevelopmentHelper;
          return res(
            ctx.status(200),
            ctx.data({
              list: [
                create({
                  status: {
                    id: DevelopmentStatusIds.ABORTED,
                    name: "開発中止",
                  },
                }),
                create({
                  status: {
                    id: DevelopmentStatusIds.COMPLETED,
                    name: "開発終了",
                  },
                }),
                create(),
              ],
              allPages: 1,
            })
          );
        }),
      ],
    },
  },
};
