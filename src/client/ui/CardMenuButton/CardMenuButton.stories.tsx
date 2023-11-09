import { Meta, StoryObj } from "@storybook/react";
import { CardMenuButton } from "./CardMenuButton";

const meta = {
  component: CardMenuButton,
} satisfies Meta<typeof CardMenuButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};