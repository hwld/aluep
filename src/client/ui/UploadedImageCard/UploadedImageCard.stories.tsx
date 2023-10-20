import { Meta, StoryObj } from "@storybook/react";
import { UploadedImageCard } from "./UploadedImageCard";

const meta = {
  component: UploadedImageCard,
} satisfies Meta<typeof UploadedImageCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    imageUrl: "/logo.svg",
    created: new Date().toString(),
    size: 10,
    onDelete: (item) => {},
  },
};
