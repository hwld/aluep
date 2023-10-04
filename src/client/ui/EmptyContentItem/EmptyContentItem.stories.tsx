import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { Meta, StoryObj } from "@storybook/react";
import { MdEmail } from "react-icons/md";

const meta = { component: EmptyContentItem } satisfies Meta<
  typeof EmptyContentItem
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    icon: <MdEmail size="100" />,
    text: "text",
    description: "description",
  },
};
