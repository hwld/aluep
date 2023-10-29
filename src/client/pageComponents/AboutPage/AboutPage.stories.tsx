import { Meta, StoryObj } from "@storybook/react";
import { AboutPage } from "./AboutPage";

const meta = {
  component: AboutPage,
} satisfies Meta<typeof AboutPage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};