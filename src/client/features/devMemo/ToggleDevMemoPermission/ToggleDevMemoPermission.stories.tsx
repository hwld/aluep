import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { ToggleDevMemoPermission } from "./ToggleDevMemoPermission";

const meta = {
  component: ToggleDevMemoPermission,
} satisfies Meta<typeof ToggleDevMemoPermission>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { dev: DevHelper.create() } };
