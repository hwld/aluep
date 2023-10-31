import { AppForm } from "@/client/ui/AppForm/AppForm";
import { Meta, StoryObj } from "@storybook/react";
import { IconCode } from "@tabler/icons-react";

const meta = { component: AppForm } satisfies Meta<typeof AppForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { submitIcon: IconCode, submitText: "送信" },
};
