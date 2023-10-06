import { UserReceivedLikeCard } from "@/client/features/user/UserDashboard/UserReceivedLikeCard/UserReceivedLikeCard";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserReceivedLikeCard } satisfies Meta<
  typeof UserReceivedLikeCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { receivedLikeCount: { developmentLikeCount: 10, ideaLikeCount: 10 } },
};
