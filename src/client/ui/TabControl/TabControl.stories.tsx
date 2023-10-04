import { TabControl } from "@/client/ui/TabControl/TabControl";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = { component: TabControl } satisfies Meta<typeof TabControl>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    activeTab: "1",
    data: [
      { value: "1", label: "投稿したお題" },
      { value: "2", label: "開発したお題" },
    ],
  },
  render: function Component(args) {
    const [tab, setTab] = useState("1");

    return (
      <TabControl {...args} activeTab={tab} onChange={(tab) => setTab(tab)} />
    );
  },
};
