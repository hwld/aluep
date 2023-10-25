import { DevMemoChild } from "@/client/features/devMemo/DevMemoChild/DevMemoChild";
import { DevMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoChild } satisfies Meta<typeof DevMemoChild>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    memo: DevMemoHelper.create({ id: "memo-id" }),
    devId: "",
  },
};
