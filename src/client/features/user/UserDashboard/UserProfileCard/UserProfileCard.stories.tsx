import { UserProfileCard } from "@/client/features/user/UserDashboard/UserProfileCard/UserProfileCard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserProfileCard } satisfies Meta<
  typeof UserProfileCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create() },
};
