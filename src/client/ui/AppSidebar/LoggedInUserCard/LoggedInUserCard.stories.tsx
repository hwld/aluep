import { LoggedInUserCard } from "@/client/ui/AppSidebar/LoggedInUserCard/LoggedInUserCard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: LoggedInUserCard } satisfies Meta<
  typeof LoggedInUserCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create(), iconWidth: 40 },
};
