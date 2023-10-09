import { DevSummaryCard } from "@/client/features/dev/DevSummaryCard/DevSummaryCard";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevSummaryCard } satisfies Meta<
  typeof DevSummaryCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { development: DevelopmentHelper.create() },
};

export const Filled: Story = {
  args: { development: DevelopmentHelper.createFilled() },
};
