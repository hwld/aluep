import { Meta, StoryObj } from "@storybook/react";
import { ErrorFallback } from "./ErrorBoundary";

const meta = {
  component: ErrorFallback,
  parameters: {
    layout: "fullscreen",
    context: "none",
  },
} satisfies Meta<typeof ErrorFallback>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
