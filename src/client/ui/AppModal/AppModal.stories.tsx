import { AppModal } from "@/client/ui/AppModal/AppModal";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppModal } satisfies Meta<typeof AppModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { opened: true, title: "アプリのモーダル" },
};
