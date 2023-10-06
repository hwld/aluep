import { IdeaLikerCard } from "@/client/features/user/IdeaLikerCard/IdeaLikerCard";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaLikerCard } satisfies Meta<typeof IdeaLikerCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { liker: { ...UserHelper.create(), likedDate: new Date() } },
};
