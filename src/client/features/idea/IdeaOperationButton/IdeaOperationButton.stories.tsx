import { IdeaOperationButton } from "@/client/features/idea/IdeaOperationButton/IdeaOperationButton";
import { IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaOperationButton } satisfies Meta<
  typeof IdeaOperationButton
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.create(), isIdeaOwner: false },
};
