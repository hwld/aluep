import { LoggedInUserMenuButton } from "@/client/ui/AppSidebar/LoggedInUserMenuButton/LoggedInUserMenuButton";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: LoggedInUserMenuButton } satisfies Meta<
  typeof LoggedInUserMenuButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    user: UserHelper.create(),
    iconWidth: 40,
  },
};
