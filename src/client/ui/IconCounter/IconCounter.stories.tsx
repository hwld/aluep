import { Meta, StoryObj } from "@storybook/react";
import { TbHeart } from "react-icons/tb";
import { IconCounter } from "./IconCounter";

const meta = {
  component: IconCounter,
} satisfies Meta<typeof IconCounter>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { icon: <TbHeart />, counter: 10 } };
