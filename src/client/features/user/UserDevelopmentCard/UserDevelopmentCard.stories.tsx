import { UserDevelopmentCard } from "@/client/features/user/UserDevelopmentCard/UserDevelopmentCard";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserDevelopmentCard } satisfies Meta<
  typeof UserDevelopmentCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { development: DevelopmentHelper.create() },
};
