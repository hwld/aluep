import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { DevDetailCardTitle } from "./DevDetailCardTitle";

const meta = {
  component: DevDetailCardTitle,
} satisfies Meta<typeof DevDetailCardTitle>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { dev: DevHelper.create() } };
