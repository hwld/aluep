import { UserSummaryHeader } from "@/client/features/user/UserSummaryHeader/UserSummaryHeader";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserSummaryHeader } satisfies Meta<
  typeof UserSummaryHeader
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create() },
};
