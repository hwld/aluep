import { LikeDevIcon } from "@/client/features/dev/LikeDevIcon/LikeDevIcon";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: LikeDevIcon } satisfies Meta<typeof LikeDevIcon>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
