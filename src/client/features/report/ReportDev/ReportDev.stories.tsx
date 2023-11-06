import { Meta, StoryObj } from "@storybook/react";
import { ReportDev } from "./ReportDev";

const meta = {
  component: ReportDev,
} satisfies Meta<typeof ReportDev>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetDeveloepr: { url: "", name: "" } },
  },
};
