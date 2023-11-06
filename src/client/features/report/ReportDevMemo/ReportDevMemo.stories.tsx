import { Meta, StoryObj } from "@storybook/react";
import { ReportDevMemo } from "./ReportDevMemo";

const meta = {
  component: ReportDevMemo,
} satisfies Meta<typeof ReportDevMemo>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { isOpen: true, onClose: () => {}, reportMeta: { targetMemoUrl: "" } },
};
