import { EmptyHomeIdeas } from "@/client/features/idea/EmptyHomeIdeas/EmptyHomeIdeas";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: EmptyHomeIdeas } satisfies Meta<
  typeof EmptyHomeIdeas
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { isLoggedIn: false },
};
