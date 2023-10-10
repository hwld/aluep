import { DevelopForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { DevStatusIds } from "@/models/developmentStatus";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopForm } satisfies Meta<typeof DevelopForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideaId: "",
    developmentStatuses: [
      { id: DevStatusIds.ABORTED, name: "開発終了" },
      { id: DevStatusIds.COMPLETED, name: "開発完了" },
      { id: DevStatusIds.IN_PROGRESS, name: "開発中" },
    ],
    submitText: "開発する",
  },
};
