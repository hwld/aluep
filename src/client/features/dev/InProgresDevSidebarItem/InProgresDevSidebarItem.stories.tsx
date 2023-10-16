import { Meta, StoryObj } from "@storybook/react";
import { DevInProgresSidebarItem } from "./InProgresDevSidebarItem";

const meta = {
  component: DevInProgresSidebarItem,
} satisfies Meta<typeof DevInProgresSidebarItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { tooltip: true, loggedInUserId: "user-id" },
};
