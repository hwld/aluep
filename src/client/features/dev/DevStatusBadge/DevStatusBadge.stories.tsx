import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { DevStatusIds } from "@/share/consts";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevStatusBadge } satisfies Meta<
  typeof DevStatusBadge
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const InProgrses: Story = {
  args: { status: { id: DevStatusIds.IN_PROGRESS, name: "開発中" } },
};

export const Aborted: Story = {
  args: { status: { id: DevStatusIds.ABORTED, name: "開発中止" } },
};

export const Completed: Story = {
  args: { status: { id: DevStatusIds.COMPLETED, name: "開発終了" } },
};
