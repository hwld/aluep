import { AppMenu } from "@/client/ui/AppMenu/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenu/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { Menu } from "@mantine/core";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = { component: AppMenu } satisfies Meta<typeof AppMenu>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: <div>item</div>, opened: true },
  render: function Render() {
    const [opened, setOpened] = useState(true);

    return (
      <AppMenu opened={opened} onClose={() => setOpened(false)}>
        <Menu.Target>
          <button onClick={() => setOpened(true)}>Target</button>
        </Menu.Target>
        <AppMenuDropdown>
          <AppMenuItem>Itemu</AppMenuItem>
          <AppMenuItem>Itemu</AppMenuItem>
          <AppMenuItem red>Itemu</AppMenuItem>
        </AppMenuDropdown>
      </AppMenu>
    );
  },
};
