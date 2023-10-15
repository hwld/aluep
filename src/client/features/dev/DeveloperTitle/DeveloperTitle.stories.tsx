import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { DeveloperTitle } from "./DeveloperTitle";

const meta = {
  component: DeveloperTitle,
} satisfies Meta<typeof DeveloperTitle>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { dev: DevHelper.create() } };
