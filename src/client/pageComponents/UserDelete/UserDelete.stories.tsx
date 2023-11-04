import { UserDelete } from "@/client/pageComponents/UserDelete/UserDelete";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/ユーザーの削除",
  component: UserDelete,
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
} satisfies Meta<typeof UserDelete>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
