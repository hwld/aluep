import { DevMemoChild } from "@/client/features/devMemo/DevMemoChild/DevMemoChild";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoChild } satisfies Meta<typeof DevMemoChild>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    memo: DevelopmentMemoHelper.create({ id: "memo-id" }),
    developmentId: "",
    ideaId: "",
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.developmentMemo.getAll, []),
      ],
    },
  },
};
