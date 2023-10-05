import { DevMemoMenuButton } from "@/client/features/devMemo/DevMemoMenuButton/DevMemoMenuButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoMenuButton } satisfies Meta<
  typeof DevMemoMenuButton
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
