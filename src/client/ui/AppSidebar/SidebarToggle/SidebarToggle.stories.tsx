import { SidebarToggle } from "@/client/ui/AppSidebar/SidebarToggle/SidebarToggle";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: SidebarToggle,
} satisfies Meta<typeof SidebarToggle>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { isOpen: true, width: "40px" },
};
