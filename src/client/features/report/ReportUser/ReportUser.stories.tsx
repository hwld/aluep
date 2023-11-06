import { Meta, StoryObj } from "@storybook/react";
import { ReportUser } from "./ReportUser";

const meta = {
  component: ReportUser,
} satisfies Meta<typeof ReportUser>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    reportMeta: { targetUser: { url: "", name: "" } },
  },
};
