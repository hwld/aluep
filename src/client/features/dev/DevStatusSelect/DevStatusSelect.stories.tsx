import { DevStatus } from "@/models/developmentStatus";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DevStatusSelect } from "./DevStatusSelect";

const meta = {
  component: DevStatusSelect,
} satisfies Meta<typeof DevStatusSelect>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    value: "IN_PROGRESS",
  },

  render: function Render() {
    const [val, setVal] = useState<DevStatus>("IN_PROGRESS");

    return <DevStatusSelect value={val} onChange={(val) => setVal(val)} />;
  },
};
