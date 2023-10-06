import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: AppTitle } satisfies Meta<typeof AppTitle>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: "Title" } };

export const Overflow: Story = {
  args: { children: "longlonglonglonglonglonglonglonglong", truncate: true },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "300px", border: "1px solid black" }}>
          <Story />
        </div>
      );
    },
  ],
};
