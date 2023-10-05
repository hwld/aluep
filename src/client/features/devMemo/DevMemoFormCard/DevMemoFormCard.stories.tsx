import { DevMemoFormCard } from "@/client/features/devMemo/DevMemoFormCard/DevMemoFormCard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoFormCard } satisfies Meta<
  typeof DevMemoFormCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { developmentId: "", loggedInUser: UserHelper.create() },
};
