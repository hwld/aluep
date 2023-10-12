import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
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
