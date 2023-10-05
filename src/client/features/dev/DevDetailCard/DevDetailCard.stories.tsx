import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevDetailCard } satisfies Meta<typeof DevDetailCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    development: DevelopmentHelper.create(),
    isDeveloper: false,
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
      ],
    },
  },
};
