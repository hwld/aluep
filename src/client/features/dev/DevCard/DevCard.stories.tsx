import { DevCard } from "@/client/features/dev/DevCard/DevCard";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevCard } satisfies Meta<typeof DevCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { dev: DevHelper.create() },
};
