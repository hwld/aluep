import { SvgFileText } from "@/client/ui/Icons";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: PageHeader } satisfies Meta<typeof PageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { icon: SvgFileText, pageName: "ページ名" },
};
