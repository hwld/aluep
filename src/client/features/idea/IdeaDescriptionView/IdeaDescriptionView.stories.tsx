import { IdeaDescriptionView } from "@/client/features/idea/IdeaDescriptionView/IdeaDescriptionView";
import { descriptionHtmlSample } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaDescriptionView } satisfies Meta<
  typeof IdeaDescriptionView
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    descriptionHtml: descriptionHtmlSample,
  },
};
