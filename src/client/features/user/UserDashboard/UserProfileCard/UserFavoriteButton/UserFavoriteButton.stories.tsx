import { UserFavoriteButton } from "@/client/features/user/UserDashboard/UserProfileCard/UserFavoriteButton/UserFavoriteButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserFavoriteButton } satisfies Meta<
  typeof UserFavoriteButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { userId: "" },
};
