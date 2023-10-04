import { AppForm } from "@/client/ui/AppForm/AppForm";
import { Meta, StoryObj } from "@storybook/react";
import { MdComputer } from "react-icons/md";

const meta = { component: AppForm } satisfies Meta<typeof AppForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { submitIcon: MdComputer, submitText: "送信" },
};
