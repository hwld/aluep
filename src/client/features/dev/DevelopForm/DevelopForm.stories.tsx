import { DevelopForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopForm } satisfies Meta<typeof DevelopForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    submitText: "開発する",
  },
};
