import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { DeleteDevModal } from "./DeleteDevModal";

const meta = {
  component: DeleteDevModal,
} satisfies Meta<typeof DeleteDevModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { isOpen: true, onClose: () => {}, dev: DevHelper.create() },
};
