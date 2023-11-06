import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { UserIconUploader } from "./UserIconUploader";

const meta = {
  component: UserIconUploader,
} satisfies Meta<typeof UserIconUploader>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { user: UserHelper.create() } };
