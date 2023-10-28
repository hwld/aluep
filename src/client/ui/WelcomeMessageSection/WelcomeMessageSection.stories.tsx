import { Meta, StoryObj } from "@storybook/react";
import { WelcomeMessageSection } from "./WelcomeMessageSection";

const meta = {
  component: WelcomeMessageSection,
} satisfies Meta<typeof WelcomeMessageSection>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};