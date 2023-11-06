import { Meta, StoryObj } from "@storybook/react";
import { ReportIdeaCommentModal } from "./ReportIdeaCommentModal";

const meta = {
  component: ReportIdeaCommentModal,
} satisfies Meta<typeof ReportIdeaCommentModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetCommentUrl: "" },
  },
};
