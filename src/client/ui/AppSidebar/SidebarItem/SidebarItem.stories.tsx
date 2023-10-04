import { SidebarItem } from "@/client/ui/AppSidebar/SidebarItem/SidebarItem";
import { Meta, StoryObj } from "@storybook/react";
import { MdHome } from "react-icons/md";

const meta = { component: SidebarItem } satisfies Meta<typeof SidebarItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { icon: MdHome, label: "ホーム" },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "300px" }}>
          <Story />
        </div>
      );
    },
  ],
};
