import { ImageCropper } from "@/client/ui/ImageCropper";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: ImageCropper } satisfies Meta<typeof ImageCropper>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { info: { image: document.createElement("img") } },
};
