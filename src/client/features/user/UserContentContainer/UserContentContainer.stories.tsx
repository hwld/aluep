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
    isEmpty: false,
    emptyIcon: <div>EmptyIcon</div>,
    emptyText: "空",
    emptyDescription: "EmptyDescription",
    children: <div>children</div>,
  },
};
