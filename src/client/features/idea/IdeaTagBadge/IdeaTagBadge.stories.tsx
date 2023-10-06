import { IdeaTagBadge } from "@/client/features/idea/IdeaTagBadge/IdeaTagBadge";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaTagBadge } satisfies Meta<typeof IdeaTagBadge>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { tagId: "id", children: "Webフロントエンド" },
};
