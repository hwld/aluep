import { IdeaCreatePage } from "@/client/pageComponents/IdeaCreatePage/IdeaCreatePage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題作成",
  component: IdeaCreatePage,
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
} satisfies Meta<typeof IdeaCreatePage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
