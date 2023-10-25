import { DevForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevForm } satisfies Meta<typeof DevForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    submitText: "開発する",
  },
};
