import { Meta, StoryObj } from "@storybook/react";
import { ReportDevMemoModal } from "./ReportDevMemoModal";

const meta = {
  component: ReportDevMemoModal,
} satisfies Meta<typeof ReportDevMemoModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { isOpen: true, onClose: () => {}, reportMeta: { targetMemoUrl: "" } },
};
