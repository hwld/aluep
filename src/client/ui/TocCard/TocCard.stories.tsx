import { Meta, StoryObj } from "@storybook/react";
import { TocCard } from "./TocCard";

const meta = {
  component: TocCard,
} satisfies Meta<typeof TocCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { contentClassName: "" } };
