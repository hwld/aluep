import { CardActionIcon } from "@/client/ui/CardActionIcon/CardActionIcon";
import { SvgMessageCircle } from "@/client/ui/Icons";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: CardActionIcon } satisfies Meta<
  typeof CardActionIcon
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Render() {
    return (
      <CardActionIcon c="gray.5">
        <SvgMessageCircle width={20} height={20} />
      </CardActionIcon>
    );
  },
};
