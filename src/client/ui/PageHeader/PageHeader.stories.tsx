import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Meta, StoryObj } from "@storybook/react";
import { FaFile } from "react-icons/fa";

const meta = { component: PageHeader } satisfies Meta<typeof PageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { icon: FaFile, pageName: "ページ名" },
};
