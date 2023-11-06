import { Meta, StoryObj } from "@storybook/react";
import { DeleteIdeaCommentModal } from "./DeleteIdeaCommentModal";

const meta = {
  component: DeleteIdeaCommentModal,
} satisfies Meta<typeof DeleteIdeaCommentModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { commentId: "", ideaId: "", isOpen: true, onClose: () => {} },
};
