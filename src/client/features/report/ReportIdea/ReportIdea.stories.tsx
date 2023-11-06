import { Meta, StoryObj } from "@storybook/react";
import { ReportIdea } from "./ReportIdea";

const meta = {
  component: ReportIdea,
} satisfies Meta<typeof ReportIdea>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetIdea: { title: "", url: "" } },
  },
};
