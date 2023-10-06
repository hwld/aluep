import { IdeaForm } from "@/client/features/idea/IdeaForm/IdeaForm";
import { IdeaTagHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaForm } satisfies Meta<typeof IdeaForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    allTags: [...new Array(10)].map(() => IdeaTagHelper.create()),
    submitText: "作成",
  },
};
