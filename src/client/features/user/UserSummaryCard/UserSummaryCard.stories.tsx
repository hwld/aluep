import { UserSummaryCard } from "@/client/features/user/UserSummaryCard/UserSummaryCard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserSummaryCard } satisfies Meta<
  typeof UserSummaryCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create() },
};
