import { SidebarItem } from "@/client/ui/SidebarItem/SidebarItem";
import { Meta, StoryObj } from "@storybook/react";
import { SvgHome } from "@tabler/icons-react";

const meta = { component: SidebarItem } satisfies Meta<typeof SidebarItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { icon: SvgHome, label: "ホーム" },
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
