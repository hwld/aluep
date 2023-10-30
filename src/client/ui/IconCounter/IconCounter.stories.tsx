import { SvgHeart } from "@/client/ui/Icons";
import { Meta, StoryObj } from "@storybook/react";
import { IconCounter } from "./IconCounter";

const meta = {
  component: IconCounter,
} satisfies Meta<typeof IconCounter>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { icon: <SvgHeart />, counter: 10 } };
