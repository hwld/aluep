import { PlainTextarea } from "@/client/ui/PlainTextarea";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: PlainTextarea } satisfies Meta<typeof PlainTextarea>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Valid: Story = {
  args: { bg: "gray.2", p: "sm" },
};

export const Invalid: Story = {
  args: { error: "エラーが発生しています", bg: "gray.2", p: "sm" },
};
