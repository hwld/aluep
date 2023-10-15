import { Meta, StoryObj } from "@storybook/react";
import { TbHeart } from "react-icons/tb";
import { IdeaCardIconCounter } from "./IdeaCardIconCounter";

const meta = {
  component: IdeaCardIconCounter,
} satisfies Meta<typeof IdeaCardIconCounter>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { icon: <TbHeart />, counter: 10 } };
