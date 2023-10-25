import { UserDeletepage } from "@/client/pageComponents/UserDeletePage/UserDeletePage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/ユーザーの削除",
  component: UserDeletepage,
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
} satisfies Meta<typeof UserDeletepage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
