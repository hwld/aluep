import { IdeaCard } from "@/client/features/idea/IdeaCard/IdeaCard";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaCard } satisfies Meta<typeof IdeaCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.create() },
};
