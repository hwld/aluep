import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentLikersPage } from "@/client/pageComponents/DevelopmentLikersPage";
import { AppLayout } from "@/client/ui/AppLayout";
import {
  DevelopmentHelper,
  DevelopmentLikerHelper,
} from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報をいいねしたユーザー",
  component: DevelopmentLikersPage,
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
} satisfies Meta<typeof DevelopmentLikersPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { development: DevelopmentHelper.create() },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.user.getDevelopmentLikers.query((req, res, ctx) => {
          const { create } = DevelopmentLikerHelper;
          return res(
            ctx.status(200),
            ctx.data({
              list: [create(), create(), create()],
              allPages: 1,
            })
          );
        }),
      ],
    },
  },
};
