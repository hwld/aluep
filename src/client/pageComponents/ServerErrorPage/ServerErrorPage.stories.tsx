import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
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
export const Default: Story = {};
