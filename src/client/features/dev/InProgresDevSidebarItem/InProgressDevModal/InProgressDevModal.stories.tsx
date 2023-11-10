import { Meta, StoryObj } from "@storybook/react";
import { InProgressDevModal } from "./InProgressDevModal";

const meta = {
  component: InProgressDevModal,
} satisfies Meta<typeof InProgressDevModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { isOpen: true, loggedInUserId: "" } };
