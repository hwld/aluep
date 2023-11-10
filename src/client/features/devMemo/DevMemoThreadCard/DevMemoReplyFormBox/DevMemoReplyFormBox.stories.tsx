import { DevMemoReplyFormBox } from "@/client/features/devMemo/DevMemoThreadCard/DevMemoReplyFormBox/DevMemoReplyFormBox";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoReplyFormBox } satisfies Meta<
  typeof DevMemoReplyFormBox
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { devId: "", parentMemoId: "" } };
