import { Meta, StoryObj } from "@storybook/react";
import { DeleteDevMemoModal } from "./DeleteDevMemoModal";

const meta = {
  component: DeleteDevMemoModal,
} satisfies Meta<typeof DeleteDevMemoModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { devId: "", devMemoId: "", isOpen: true, onClose: () => {} },
};
