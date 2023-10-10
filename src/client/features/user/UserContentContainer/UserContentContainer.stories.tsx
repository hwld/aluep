import { UserContentContainer } from "@/client/features/user/UserContentContainer/UserContentContainer";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserContentContainer } satisfies Meta<
  typeof UserContentContainer
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    page: 1,
    totalPages: 10,
    itemMinWidthPx: 300,
    emptyProps: {
      isEmpty: false,
      icon: <div>EmptyIcon</div>,
      text: "空",
      description: "EmptyDescription",
    },
    children: <div>children</div>,
  },
};
