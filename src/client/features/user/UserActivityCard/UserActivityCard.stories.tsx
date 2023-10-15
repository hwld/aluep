import { UserActivityCard } from "@/client/features/user/UserActivityCard/UserActivityCard";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserActivityCard } satisfies Meta<
  typeof UserActivityCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    userActivity: {
      devCount: 10,
      likedIdeaCount: 3,
      postedIdeaCount: 9,
    },
  },
};
