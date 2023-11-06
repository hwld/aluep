import { Meta, StoryObj } from "@storybook/react";
import { DeleteUploadedImageModal } from "./DeleteUploadedImageModal";

const meta = {
  component: DeleteUploadedImageModal,
} satisfies Meta<typeof DeleteUploadedImageModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { isOpen: true, onClose: () => {}, imageUrl: "" },
};
