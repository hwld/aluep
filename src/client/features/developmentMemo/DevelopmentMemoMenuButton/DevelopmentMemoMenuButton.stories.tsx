import { DevelopmentMemoMenuButton } from "@/client/features/developmentMemo/DevelopmentMemoMenuButton/DevelopmentMemoMenuButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopmentMemoMenuButton } satisfies Meta<
  typeof DevelopmentMemoMenuButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    developmentId: "",
    developmentMemoId: "",
    ideaId: "",
    isOwner: true,
    isDeleting: false,
  },
};
