import { DevMemoThreadCard } from "@/client/features/devMemo/DevMemoThreadCard/DevMemoThreadCard";
import { DevMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoThreadCard } satisfies Meta<
  typeof DevMemoThreadCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    devId: "",
    memo: DevMemoHelper.create(),
    childrenMemos: [...new Array(5)].map(() => DevMemoHelper.create()),
  },
};
