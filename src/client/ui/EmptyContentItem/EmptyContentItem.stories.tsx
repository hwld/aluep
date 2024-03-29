import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { Meta, StoryObj } from "@storybook/react";
import { IconMail } from "@tabler/icons-react";

const meta = { component: EmptyContentItem } satisfies Meta<
  typeof EmptyContentItem
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    icon: <IconMail width="100" height="100" />,
    text: "text",
    description: "description",
  },
};
