import { Meta, StoryObj } from "@storybook/react";
import { MutedText } from "./MutedText";

const meta = {
  component: MutedText,
} satisfies Meta<typeof MutedText>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: "muted text" } };
