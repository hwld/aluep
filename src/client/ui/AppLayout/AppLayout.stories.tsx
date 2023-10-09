import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppLayout } satisfies Meta<typeof AppLayout>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: <div>content</div> },
  parameters: {
    msw: {
      handlers: [mockTrpcQuery(trpcMsw.session, null)],
    },
  },
};
