import { Meta, StoryObj } from "@storybook/react";
import { DeleteIdeaModal } from "./DeleteIdeaModal";

const meta = {
  component: DeleteIdeaModal,
} satisfies Meta<typeof DeleteIdeaModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { isOpen: true, onClose: () => {}, ideaId: "" },
};
