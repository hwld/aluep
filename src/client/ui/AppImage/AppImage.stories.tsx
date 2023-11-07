import { Meta, StoryObj } from "@storybook/react";
import { AppImage } from "./AppImage";

const meta = {
  component: AppImage,
} satisfies Meta<typeof AppImage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { src: "/Alert.svg", alt: "", width: 100, height: 100 },
};
