import { Meta, StoryObj } from "@storybook/react";
import { UserSection } from "./UserSection";

const meta = {
  component: UserSection,
} satisfies Meta<typeof UserSection>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { title: "user", userId: "", userIconSrc: "" },
};
