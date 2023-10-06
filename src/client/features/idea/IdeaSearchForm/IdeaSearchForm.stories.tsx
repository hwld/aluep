import { IdeaSearchForm } from "@/client/features/idea/IdeaSearchForm/IdeaSearchForm";
import { IdeaTagHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaSearchForm } satisfies Meta<
  typeof IdeaSearchForm
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { allTags: [...new Array(10)].map(() => IdeaTagHelper.create()) },
};
