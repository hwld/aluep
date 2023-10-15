import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { IdeaCardLikeCounter } from "./IdeaCardLikeCounter";

const meta = {
  component: IdeaCardLikeCounter,
} satisfies Meta<typeof IdeaCardLikeCounter>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { idea: IdeaHelper.create() } };
