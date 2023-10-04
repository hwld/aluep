import { DevelopmentMemoFormCard } from "@/client/features/developmentMemo/DevelopmentMemoFormCard/DevelopmentMemoFormCard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopmentMemoFormCard } satisfies Meta<
  typeof DevelopmentMemoFormCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { developmentId: "", loggedInUser: UserHelper.create() },
};
