import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserIcon } satisfies Meta<typeof UserIcon>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
