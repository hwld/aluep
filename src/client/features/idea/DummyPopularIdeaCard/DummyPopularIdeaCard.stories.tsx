import { Meta, StoryObj } from "@storybook/react";
import { DummyPopularIdeaCard } from "./DummyPopularIdeaCard";

const meta = {
  component: DummyPopularIdeaCard,
} satisfies Meta<typeof DummyPopularIdeaCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};