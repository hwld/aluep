import { DevelopmentMemoReplyFormBox } from "@/client/features/developmentMemo/DevelopMemoReplyFormBox/DevelopMemoReplyFormBox";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopmentMemoReplyFormBox } satisfies Meta<
  typeof DevelopmentMemoReplyFormBox
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
