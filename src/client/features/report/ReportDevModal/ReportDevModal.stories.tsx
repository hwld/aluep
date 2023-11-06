import { Meta, StoryObj } from "@storybook/react";
import { ReportDevModal } from "./ReportDevModal";

const meta = {
  component: ReportDevModal,
} satisfies Meta<typeof ReportDevModal>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetDeveloepr: { url: "", name: "" } },
  },
};
