import { DevDetailMenuButton } from "@/client/features/dev/DevDetailMenuButton/DevDetailMenuButton";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevDetailMenuButton } satisfies Meta<
  typeof DevDetailMenuButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { dev: DevHelper.create(), isOwner: false },
};
