import { DevEdit } from "@/client/pageComponents/DevEdit/DevEdit";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { DevHelper, IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の編集",
  component: DevEdit,
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
} satisfies Meta<typeof DevEdit>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    idea: IdeaHelper.createFilled(),
    dev: DevHelper.createFilled(),
  },
};

export const DeletedIdea: Story = {
  args: { idea: undefined, dev: DevHelper.create() },
};
