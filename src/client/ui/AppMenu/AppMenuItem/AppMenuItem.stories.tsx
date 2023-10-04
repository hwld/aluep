import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { Menu } from "@mantine/core";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppMenuItem } satisfies Meta<typeof AppMenuItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: <div>Item</div> },
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
