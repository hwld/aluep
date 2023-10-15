import { UserReceivedLikeCard } from "@/client/features/user/UserReceivedLikeCard/UserReceivedLikeCard";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserReceivedLikeCard } satisfies Meta<
  typeof UserReceivedLikeCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { receivedLikeCount: { devLikeCount: 10, ideaLikeCount: 10 } },
};
