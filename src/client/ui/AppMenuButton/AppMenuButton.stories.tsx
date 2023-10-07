import { AppMenu } from "@/client/ui/AppMenu/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenu/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppMenuButton } satisfies Meta<typeof AppMenuButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  decorators: [
    (Story) => {
      return (
        <AppMenu>
          <Story />

          <AppMenuDropdown>
            <AppMenuItem>Item</AppMenuItem>
          </AppMenuDropdown>
        </AppMenu>
      );
    },
  ],
};
