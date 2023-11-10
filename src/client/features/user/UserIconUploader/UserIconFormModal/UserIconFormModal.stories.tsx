import { UserIconFormModal } from "@/client/features/user/UserIconUploader/UserIconFormModal/UserIconFormModal";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserIconFormModal } satisfies Meta<
  typeof UserIconFormModal
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { userIconUrl: "" },
};
