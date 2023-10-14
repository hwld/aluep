import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevStatusBadge } satisfies Meta<
  typeof DevStatusBadge
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const InProgrses: Story = {
  args: { status: "IN_PROGRESS" },
};

export const Aborted: Story = {
  args: { status: "ABORTED" },
};

export const Completed: Story = {
  args: { status: "COMPLETED" },
};
