import { Meta, StoryObj } from "@storybook/react";
import { WelcomeCard } from "./WelcomeCard";

const meta = {
  component: WelcomeCard,
} satisfies Meta<typeof WelcomeCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
