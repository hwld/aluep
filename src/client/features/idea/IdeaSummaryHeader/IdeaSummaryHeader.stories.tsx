import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaSummaryHeader } satisfies Meta<
  typeof IdeaSummaryHeader
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    idea: IdeaHelper.create({
      title: "TwitterみたいなWebアプリ",
      user: { name: "hwld", id: "", image: "" },
    }),
  },
};

export const DeletedIdea: Story = {
  args: { idea: undefined },
};
