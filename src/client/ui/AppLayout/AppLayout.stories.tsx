import { trpcMsw } from "@/client/__mocks__/trpc";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppLayout } satisfies Meta<typeof AppLayout>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: <div>content</div> },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
      ],
    },
  },
};
