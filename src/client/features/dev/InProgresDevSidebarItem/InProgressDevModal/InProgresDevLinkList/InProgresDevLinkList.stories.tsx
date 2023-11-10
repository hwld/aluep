import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { InProgresDevLinkList } from "./InProgresDevLinkList";

const meta = {
  component: InProgresDevLinkList,
} satisfies Meta<typeof InProgresDevLinkList>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { devs: [...new Array(10)].map(() => DevHelper.create()) },
};
