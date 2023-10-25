import { DevMenuButton } from "@/client/features/dev/DevMenuButton/DevMenuButton";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMenuButton } satisfies Meta<typeof DevMenuButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { dev: DevHelper.create(), isOwner: false },
};
