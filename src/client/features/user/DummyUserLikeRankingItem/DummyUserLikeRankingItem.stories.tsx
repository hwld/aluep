import { Meta, StoryObj } from "@storybook/react";
import { DummyUserLikeRankingItem } from "./DummyUserLikeRankingItem";

const meta = {
  component: DummyUserLikeRankingItem,
} satisfies Meta<typeof DummyUserLikeRankingItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};