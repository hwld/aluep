import { LikedDevCard } from "@/client/features/dev/LikedDevCard/LikedDevCard";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: LikedDevCard } satisfies Meta<typeof LikedDevCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { development: DevelopmentHelper.create() },
};