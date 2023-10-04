import { TextLink } from "@/client/ui/TextLink";
import { Text } from "@mantine/core";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: TextLink } satisfies Meta<typeof TextLink>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { href: "google.com", children: <Text c="gray.7">Link</Text> },
};
