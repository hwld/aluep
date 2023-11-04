import { DevelopIdea } from "@/client/pageComponents/DevelopIdea/DevelopIdea";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の開発",
  component: DevelopIdea,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <AppLayout>
          <Story />
        </AppLayout>
      );
    },
  ],
} satisfies Meta<typeof DevelopIdea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilledIdea: Story = {
  args: { idea: IdeaHelper.createFilled() },
};
