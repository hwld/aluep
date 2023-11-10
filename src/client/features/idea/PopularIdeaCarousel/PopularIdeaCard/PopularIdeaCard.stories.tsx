import { PopularIdeaCard } from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCard/PopularIdeaCard";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: PopularIdeaCard } satisfies Meta<
  typeof PopularIdeaCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.create() },
};
