import { CardActionIcon } from "@/client/ui/CardActionIcon/CardActionIcon";
import { Meta, StoryObj } from "@storybook/react";
import { FaRegComment } from "react-icons/fa";

const meta = { component: CardActionIcon } satisfies Meta<
  typeof CardActionIcon
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Render() {
    return (
      <CardActionIcon>
        <FaRegComment color="var(--mantine-color-gray-5)" size={20} />
      </CardActionIcon>
    );
  },
};
