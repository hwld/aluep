import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { Meta, StoryObj } from "@storybook/react";
import { TbMail } from "react-icons/tb";

const meta = { component: EmptyContentItem } satisfies Meta<
  typeof EmptyContentItem
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    icon: <TbMail size="100" />,
    text: "text",
    description: "description",
  },
};
