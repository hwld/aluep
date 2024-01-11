import { Meta, StoryObj } from "@storybook/react";
import { CardMenuButton } from "./CardMenuButton";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";

const meta = {
  component: CardMenuButton,
} satisfies Meta<typeof CardMenuButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  decorators: [
    (Story) => (
      <AppMenu>
        <Story />
      </AppMenu>
    ),
  ],
};
