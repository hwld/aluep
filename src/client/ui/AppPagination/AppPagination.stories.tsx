import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppPagination } satisfies Meta<typeof AppPagination>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { value: 1, total: 100 },
};
