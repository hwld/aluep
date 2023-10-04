import { trpcMsw } from "@/client/__mocks__/trpc";
import { UserEditPage } from "@/client/pageComponents/UserEditPage/UserEditPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/ユーザーの編集",
  component: UserEditPage,
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
} satisfies Meta<typeof UserEditPage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create({ profile: "profile" }) },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({
              expires: "",
              user: UserHelper.create(),
            })
          );
        }),
        trpcMsw.me.getMySummary.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ allLikes: 0, developments: 0, ideas: 0 })
          );
        }),
      ],
    },
  },
};
