import { DevStatusIds } from "@/models/developmentStatus";
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
    allStatuses: [
      { id: DevStatusIds.ABORTED, name: "開発中止" },
      { id: DevStatusIds.COMPLETED, name: "開発完了" },
      { id: DevStatusIds.IN_PROGRESS, name: "開発中" },
    ],
    value: "",
  },

  render: function Render() {
    const [val, setVal] = useState("");

    return (
      <DevStatusSelect
        value={val}
        onChange={(val) => setVal(val)}
        allStatuses={[
          { id: DevStatusIds.ABORTED, name: "開発中止" },
          { id: DevStatusIds.COMPLETED, name: "開発完了" },
          { id: DevStatusIds.IN_PROGRESS, name: "開発中" },
        ]}
      />
    );
  },
};
