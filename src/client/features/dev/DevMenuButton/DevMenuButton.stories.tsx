import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevMenuButton } from "@/client/features/dev/DevMenuButton/DevMenuButton";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMenuButton } satisfies Meta<typeof DevMenuButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { development: DevelopmentHelper.create(), isOwner: false },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.development.isDevelopedByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data({ developed: false }));
        }),
      ],
    },
  },
};
