import { SidebarAppTitle } from "@/client/ui/SidebarAppTitle/SidebarAppTitle";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: SidebarAppTitle,
} satisfies Meta<typeof SidebarAppTitle>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
