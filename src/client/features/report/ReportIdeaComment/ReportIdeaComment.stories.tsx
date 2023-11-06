import { Meta, StoryObj } from "@storybook/react";
import { ReportIdeaComment } from "./ReportIdeaComment";

const meta = {
  component: ReportIdeaComment,
} satisfies Meta<typeof ReportIdeaComment>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetCommentUrl: "" },
  },
};
