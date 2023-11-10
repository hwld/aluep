import { DevLikeButton } from "@/client/features/dev/DevDetailCard/DevLikeButton/DevLikeButton";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevLikeButton } satisfies Meta<typeof DevLikeButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    dev: DevHelper.create(),
  },
};
