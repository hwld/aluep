import { DevSummaryHeader } from "@/client/features/dev/DevSummaryHeader/DevSummaryHeader";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevSummaryHeader } satisfies Meta<
  typeof DevSummaryHeader
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { development: DevelopmentHelper.create() },
};

export const Filled: Story = {
  args: { development: DevelopmentHelper.createFilled() },
};
