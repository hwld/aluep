import { trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaLikersPage } from "@/client/pageComponents/IdeaLikersPage";
import { AppLayout } from "@/client/ui/AppLayout";
import { IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題をいいねしたユーザー",
  component: IdeaLikersPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppLayout>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof IdeaLikersPage>;
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
        trpcMsw.user.getIdeaLikers.query((req, res, ctx) => {
          const { create } = UserHelper;
          return res(
            ctx.status(200),
            ctx.data({
              list: [
                { ...create(), likedDate: new Date() },
                { ...create(), likedDate: new Date() },
                { ...create(), likedDate: new Date() },
              ],
              allPages: 1,
            })
          );
        }),
      ],
    },
  },
};
