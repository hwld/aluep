import { AppForm } from "@/client/ui/AppForm/AppForm";
import { SvgCode } from "@/client/ui/Icons";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppForm } satisfies Meta<typeof AppForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { submitIcon: SvgCode, submitText: "送信" },
};
