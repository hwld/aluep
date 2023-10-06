import { EmptyUserSearchResult } from "@/client/features/user/EmptyUserSearchResult/EmptyUserSearchResult";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: EmptyUserSearchResult } satisfies Meta<
  typeof EmptyUserSearchResult
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
