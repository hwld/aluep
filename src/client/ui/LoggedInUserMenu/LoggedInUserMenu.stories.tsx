import { LoggedInUserMenu } from "@/client/ui/LoggedInUserMenu/LoggedInUserMenu";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: LoggedInUserMenu } satisfies Meta<
  typeof LoggedInUserMenu
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create(), trigger: <button>Trigger</button> },
};
