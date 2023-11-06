import { Meta, StoryObj } from "@storybook/react";
import { ReportIdeaModal } from "./ReportIdeaModal";

const meta = {
  component: ReportIdeaModal,
} satisfies Meta<typeof ReportIdeaModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetIdea: { title: "", url: "" } },
  },
};
