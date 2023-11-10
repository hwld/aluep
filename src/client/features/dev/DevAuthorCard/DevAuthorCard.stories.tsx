import { DevAuthorCard } from "@/client/features/dev/DevAuthorCard/DevAuthorCard";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevAuthorCard } satisfies Meta<typeof DevAuthorCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { dev: DevHelper.create() },
};
