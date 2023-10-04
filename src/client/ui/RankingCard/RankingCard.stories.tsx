import { RankingCard } from "@/client/ui/RankingCard/RankingCard";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: RankingCard,
} satisfies Meta<typeof RankingCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    title: "ランキング",
    children: (
      <div>
        <div>item1</div>
        <div>item2</div>
        <div>item3</div>
      </div>
    ),
  },
};
