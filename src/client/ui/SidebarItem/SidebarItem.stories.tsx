import { SidebarItem } from "@/client/ui/SidebarItem/SidebarItem";
import { Meta, StoryObj } from "@storybook/react";
import { TbHome } from "react-icons/tb";

const meta = { component: SidebarItem } satisfies Meta<typeof SidebarItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { icon: TbHome, label: "ホーム" },
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
