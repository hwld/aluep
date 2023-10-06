import { UserProfileForm } from "@/client/features/user/UserProfileForm/UserProfileForm";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserProfileForm } satisfies Meta<
  typeof UserProfileForm
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { submitText: "変更" } };
