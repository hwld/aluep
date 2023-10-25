import { UserDevCard } from "@/client/features/user/UserDevCard/UserDevCard";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserDevCard } satisfies Meta<typeof UserDevCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { dev: DevHelper.create() },
};

export const DeletedIdea: Story = {
  args: { dev: DevHelper.create({ idea: null }) },
};
