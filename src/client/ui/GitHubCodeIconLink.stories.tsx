import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: GitHubCodeIconLink } satisfies Meta<
  typeof GitHubCodeIconLink
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { gitHubUrl: "https://github.com/hwld/aluep" },
};
