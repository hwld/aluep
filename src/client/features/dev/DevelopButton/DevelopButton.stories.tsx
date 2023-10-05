import { DevelopButton } from "@/client/features/dev/DevelopButton/DevelopButton";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopButton } satisfies Meta<typeof DevelopButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideaId: "",
    developments: 0,
    loggedInUserDevelopedData: { developed: false },
  },
};
