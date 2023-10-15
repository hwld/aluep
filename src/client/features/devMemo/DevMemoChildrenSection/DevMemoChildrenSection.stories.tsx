import { DevMemoChildrenSection } from "@/client/features/devMemo/DevMemoChildrenSection/DevMemoChildrenSection";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoChildrenSection } satisfies Meta<
  typeof DevMemoChildrenSection
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideaId: "",
    devId: "",
    childMemos: [...new Array(3)].map(() => DevMemoHelper.create()),
    isOpenReplyForm: true,
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.devMemo.getAll, []),
      ],
    },
  },
};
