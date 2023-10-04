import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: ReportForm } satisfies Meta<typeof ReportForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { submitText: "通報する" },
};
