import { DevTitleCard } from "@/client/features/dev/DevTitleCard/DevTitleCard";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevTitleCard } satisfies Meta<typeof DevTitleCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { dev: DevHelper.create() },
};

export const DeletedIdea: Story = {
  args: { dev: DevHelper.create({ idea: null }) },
};
