import { Meta, StoryObj } from "@storybook/react";
import { UserUploadedImagesPage } from "./UserUploadedImagesPage";

const meta = {
  component: UserUploadedImagesPage,
} satisfies Meta<typeof UserUploadedImagesPage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};