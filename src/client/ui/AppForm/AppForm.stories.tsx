import { AppForm } from "@/client/ui/AppForm/AppForm";
import { Meta, StoryObj } from "@storybook/react";
import { TbCode } from "react-icons/tb";

const meta = { component: AppForm } satisfies Meta<typeof AppForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { submitIcon: TbCode, submitText: "送信" },
};
