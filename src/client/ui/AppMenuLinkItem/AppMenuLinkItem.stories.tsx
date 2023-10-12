import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { Menu } from "@mantine/core";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppMenuLinkItem } satisfies Meta<
  typeof AppMenuLinkItem
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { href: "https://example.com", children: "MenuLinkItem" },
  decorators: [
    (Story) => {
      return (
        <Menu opened={true} width={300}>
          <Menu.Dropdown>
            <Story />
          </Menu.Dropdown>
        </Menu>
      );
    },
  ],
};
