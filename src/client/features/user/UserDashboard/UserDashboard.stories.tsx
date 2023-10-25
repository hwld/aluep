import { UserDashboard } from "@/client/features/user/UserDashboard/UserDashboard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserDashboard } satisfies Meta<typeof UserDashboard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create() },
};
