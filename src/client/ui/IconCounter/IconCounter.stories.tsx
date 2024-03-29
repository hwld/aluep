import { Meta, StoryObj } from "@storybook/react";
import { IconHeart } from "@tabler/icons-react";
import { IconCounter } from "./IconCounter";

const meta = {
  component: IconCounter,
} satisfies Meta<typeof IconCounter>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { icon: <IconHeart />, counter: 10 } };
