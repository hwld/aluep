import { Meta, StoryObj } from "@storybook/react";
import { ReportUserModal } from "./ReportUserModal";

const meta = {
  component: ReportUserModal,
} satisfies Meta<typeof ReportUserModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetUser: { url: "", name: "" } },
  },
};
