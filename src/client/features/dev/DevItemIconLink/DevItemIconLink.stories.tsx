import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevItemIconLink } satisfies Meta<
  typeof DevItemIconLink
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { url: "url" } };
