import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { SvgMail } from "@/client/ui/Icons";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: EmptyContentItem } satisfies Meta<
  typeof EmptyContentItem
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    icon: <SvgMail width="100" height="100" />,
    text: "text",
    description: "description",
  },
};
