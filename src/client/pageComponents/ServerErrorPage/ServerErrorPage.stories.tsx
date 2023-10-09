import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import ServerErrorPage from "@/pages/500";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/500",
  component: ServerErrorPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <AppLayout>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof ServerErrorPage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  parameters: { msw: { handlers: [mockTrpcQuery(trpcMsw.session, null)] } },
};
