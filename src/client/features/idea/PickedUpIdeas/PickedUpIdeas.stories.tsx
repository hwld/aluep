import { PickedUpIdeas } from "@/client/features/idea/PickedUpIdeas/PickedUpIdeas";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: PickedUpIdeas } satisfies Meta<typeof PickedUpIdeas>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideas: [...new Array(6)].map(() => IdeaHelper.create()),
    title: "title",
    readMoreHref: "https://example.com",
  },
};
