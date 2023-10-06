import { UserProfileMenuButton } from "@/client/features/user/UserProfileMenuButton/UserProfileMenuButton";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserProfileMenuButton } satisfies Meta<
  typeof UserProfileMenuButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create(), isOwner: true },
};
