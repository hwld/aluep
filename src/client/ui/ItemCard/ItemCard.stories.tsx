import { Meta, StoryObj } from "@storybook/react";
import { ItemCard } from "./ItemCard";

const meta = {
  component: ItemCard,
} satisfies Meta<typeof ItemCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: <>Content</> },
};
