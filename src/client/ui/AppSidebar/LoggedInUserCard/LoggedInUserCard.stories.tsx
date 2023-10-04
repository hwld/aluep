import { trpcMsw } from "@/client/__mocks__/trpc";
import { LoggedInUserCard } from "@/client/ui/AppSidebar/LoggedInUserCard/LoggedInUserCard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: LoggedInUserCard } satisfies Meta<
  typeof LoggedInUserCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create(), iconWidth: 40 },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.me.getMySummary.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ ideas: 10, allLikes: 5, developments: 0 })
          );
        }),
      ],
    },
  },
};