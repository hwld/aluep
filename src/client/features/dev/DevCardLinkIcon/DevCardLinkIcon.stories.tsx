import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { Meta, StoryObj } from "@storybook/react";
import { IconFileText } from "@tabler/icons-react";

const meta = { component: DevCardIconLink } satisfies Meta<
  typeof DevCardIconLink
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    icon: (
      <IconFileText
        width="80%"
        height="80%"
        color="var(--mantine-color-gray-7)"
      />
    ),
    label: "Label",
    url: "url",
  },
};
