import { EmptyRankingContent } from "@/client/ui/EmptyRankingContent/EmptyRankingContent";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: EmptyRankingContent } satisfies Meta<
  typeof EmptyRankingContent
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { page: "developments" },
};
