import { IdeaSummaryCard } from "@/client/features/idea/IdeaSummaryCard/IdeaSummaryCard";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaSummaryCard } satisfies Meta<
  typeof IdeaSummaryCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.create() },
};
