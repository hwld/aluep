import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import NotFoundPage from "@/pages/404";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/404",
  component: NotFoundPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <AppLayout>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof NotFoundPage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
