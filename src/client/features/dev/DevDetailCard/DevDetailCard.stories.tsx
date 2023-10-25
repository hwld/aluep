import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevDetailCard } satisfies Meta<typeof DevDetailCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dev: DevHelper.create(),
    isDeveloper: false,
  },
};

export const Filled: Story = {
  args: {
    dev: DevHelper.createFilled(),
    isDeveloper: false,
  },
};

export const DeletedIdea: Story = {
  args: { dev: DevHelper.create({ idea: null }), isDeveloper: false },
};
