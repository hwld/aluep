import { Meta, StoryObj } from "@storybook/react";
import { IconMessage2 } from "@tabler/icons-react";
import { CardActionButton } from "./CardActionButton";

const meta = {
  component: CardActionButton,
} satisfies Meta<typeof CardActionButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { icon: <IconMessage2 /> } };
