import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppLayout } satisfies Meta<typeof AppLayout>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: <div>content</div> },
};
