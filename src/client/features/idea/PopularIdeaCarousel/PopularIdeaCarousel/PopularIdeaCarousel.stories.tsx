import { PopularIdeaCarousel } from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCarousel/PopularIdeaCarousel";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: PopularIdeaCarousel } satisfies Meta<
  typeof PopularIdeaCarousel
>;
export default meta;

type Story = StoryObj<typeof meta>;

const { create } = IdeaHelper;
export const Default: Story = {
  args: { ideas: [create(), create(), create(), create(), create()] },
};
