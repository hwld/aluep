import { UserActivityCard } from "@/client/features/user/UserDashboard/UserActivityCard/UserActivityCard";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserActivityCard } satisfies Meta<
  typeof UserActivityCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    userActivity: {
      developmentCount: 10,
      likedIdeaCount: 3,
      postedIdeaCount: 9,
    },
  },
};
