import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserIconLink } satisfies Meta<typeof UserIconLink>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { userId: "user-id" },
};
