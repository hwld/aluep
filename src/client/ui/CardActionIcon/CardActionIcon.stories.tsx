import { CardActionIcon } from "@/client/ui/CardActionIcon/CardActionIcon";
import { Meta, StoryObj } from "@storybook/react";
import { TbMessageCircle } from "react-icons/tb";

const meta = { component: CardActionIcon } satisfies Meta<
  typeof CardActionIcon
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Render() {
    return (
      <CardActionIcon c="gray.5">
        <TbMessageCircle size={20} />
      </CardActionIcon>
    );
  },
};
