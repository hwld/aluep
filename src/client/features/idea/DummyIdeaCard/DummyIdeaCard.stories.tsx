import { Meta, StoryObj } from "@storybook/react";
import { DummyIdeaCard } from "./DummyIdeaCard";

const meta = {
  component: DummyIdeaCard,
} satisfies Meta<typeof DummyIdeaCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};